#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

import AWS from 'aws-sdk';
import chalk from 'chalk';
import debugModule from 'debug';
import Kanjo from 'kanjo';
import Table from 'cli-table';
import loader from 'aws-sdk-config-loader';
import roundTo from 'round-to';
import toml from 'toml';
import osHomedir from 'os-homedir';
import yargs from 'yargs';

import pkg from '../package.json';

const debug = debugModule('kanjo:cli');


const args = yargs
  .usage('Usage: kanjo [options] [yyyymm]')
  .example('kanjo --accont=foo --bucket=bar', 'Show charges of current month')
  .example('kanjo --accont=foo --bucket=bar 201507', 'Show charges of July, 2015')
  .option('o', {
    alias: 'output',
    describe: 'Set output format',
    choices: ['table', 'text'],
    'default': 'table'
  })
  .option('p', {
    alias: 'profile',
    describe: 'Set profile name (default: default)',
    'default': () => {
      return process.env.AWS_PROFILE || 'default';
    },
    type: 'string'
  })
  .option('c', {
    alias: 'config',
    describe: 'Set config file path loading options',
    'default': path.join(osHomedir(), '.kanjo'),
    type: 'string'
  })
  .option('account', {
    describe: 'Set account id for billing',
    type: 'string'
  })
  .option('bucket', {
    describe: 'Set S3 bucket name storeing billing csv',
    type: 'string'
  })
  .option('region', {
    describe: 'Set S3 region name storeing billing csv',
    type: 'string'
  })
  .help('help')
  .version(pkg.version)
  .detectLocale(false)
  .wrap(null);


/**
 * round number
 *
 * @param {number|string} num number to round
 * @return {number|string}
 */
function round(num) {
  if (typeof num === 'number') {
    return roundTo(num, 2);
  }
  return num;
}


/**
 * date string to Date object
 *
 * @param {string} yyyymm date string
 * @return {Date}
 */
function parseDateStr(yyyymm) {
  const match = /(\d{4})(0[1-9]|1[0-2])/.exec(yyyymm);
  if (!match) {
    throw new Error('Set valid date string. ex. 201509');
  }
  return new Date(Number.parseInt(match[1], 10), Number.parseInt(match[2], 10) - 1);
}


/**
 * output by table format
 *
 * @param {Report} report report
 */
function outputTable(report) {
  const headStyle = chalk.bold.gray;
  const head = ['', 'Consolidated'].concat(report.accounts.map(b => b.accountName));
  const table = new Table({
    head: head.map(x => headStyle(x)),
    chars: {
      top: '', 'top-mid': '', 'top-left': '', 'top-right': '',
      bottom: '', 'bottom-mid': '', 'bottom-left': ' ', 'bottom-right': ' ',
      left: ' ', 'left-mid': '',
      mid: ' ', 'mid-mid': ' ',
      right: '', 'right-mid': '',
      middle: ' '
    },
    style: {compact: true, 'padding-right': 1, 'padding-left': 0, head: ['gray']},
    colAligns: head.map(() => 'right')
  });
  let rows = report.total.sortedProducts.map(charge => {
    const code = charge.code;
    const costs = [charge.cost].concat(report.accounts.map(b => {
      return b.products[code] ? b.products[code] : '';
    }));
    return {[headStyle(charge.shortCode)]: costs.map(round)};
  });
  const totalCosts = [report.total.totalCost].concat(report.accounts.map(b => b.totalCost));
  rows = [{
    [headStyle.green('Total')]: totalCosts.map(round).map(x => chalk.green(x))
  }].concat(rows);
  table.push(...rows);
  console.log(table.toString());
}


/**
 * output by TSV format
 *
 * @param {Report} report report
 */
function outputTSV(report) {
  const data = [['Consolidated', 'Total', report.total.totalCost]];
  report.total.sortedProducts.forEach(p => {
    data.push(['Consolidated', p.shortCode, p.cost]);
  });
  report.accounts.forEach(a => {
    data.push([a.accountName, 'Total', a.totalCost]);
    a.sortedProducts.forEach(p => {
      data.push([a.accountName, p.shortCode, p.cost]);
    });
  });
  console.log(data.map(row => {
    return row.map(r => r.toString()).join('\t');
  }).join('\n'));
}


/**
 * output report
 *
 * @param {Report} report report
 * @param {string} format output format
 */
function output(report, format) {
  if (format === 'table') {
    outputTable(report);
  } else {
    outputTSV(report);
  }
}


/**
 * output error
 *
 * @param {Error|string} err error
 */
function error(err) {
  console.error(chalk.red(err));
  process.exit(1);
}


/**
 * load options from config file and merge cli options
 *
 * @param {Object} yargsArg yarg object
 * @return {Object}
 */
function loadDefaultOptions(yargsArg) {
  const argv = yargsArg.argv;
  let defaults = null;
  try {
    const configs = toml.parse(fs.readFileSync(argv.config));
    defaults = configs[argv.profile] || {};
  } catch (err) {
    defaults = {};
  }
  return Object.assign({}, yargsArg.default(defaults).argv);
}


/**
 * execute
 *
 * @param {string} yyyymm target month
 * @param {Object} options command line options
 */
function execute(yyyymm, options) {
  const date = yyyymm ? parseDateStr(yyyymm) : new Date();
  debug('date', date);
  debug('options', options);
  loader(AWS, {profile: options.profile});
  new Kanjo(options)
    .fetch(date.getFullYear(), date.getMonth() + 1).then(report => {
      output(report, options.output);
    }).catch(err => error(err));
}


try {
  const argv = loadDefaultOptions(args);
  execute(argv._.length > 0 ? argv._[0] : null, argv);
} catch (err) {
  error(err);
}
