# kanjo-cli

[![NPM version][npm-image]][npm-url]
[![NPM downloads][npm-download-image]][npm-download-url]
[![Build Status][travis-image]][travis-url]
[![Dependency Status][daviddm-image]][daviddm-url]
[![DevDependency Status][daviddm-dev-image]][daviddm-dev-url]
[![License][license-image]][license-url]

CLI for Summarize AWS Billing


## Installation

```
npm install --global kanjo-cli
```


## Configuration

### AWS Credentials & Region

You can create the credential file yourself. By default, its location is at `~/.aws/credentials`

```
[default]
aws_access_key_id = YOUR_ACCESS_KEY
aws_secret_access_key = YOUR_SECRET_KEY
```

You may also want to set a default region. This can be done in the configuration file. By default, its location is at `~/.aws/config`

```
[default]
region = us-east-1
```

More detailed configurations, please see following articles.

- [Configuring the SDK in Node.js — AWS SDK for JavaScript](http://docs.aws.amazon.com/AWSJavaScriptSDK/guide/node-configuring.html).
- [Configuring the AWS Command Line Interface - AWS Command Line Interface](http://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html)


### Default options

You can create the config file to omit options for CLI.
By default, its location is at `~/.kanjo`.

```toml
[default]
account = "BILLING_ACCOUNT_ID"
bucket = "S3_BUCKET_NAME_STOREING_BLLING_CSV"
```

You can write options per profile similar to AWS credentials and config.
But, Format of this file is TOML.


## Usage

```
Usage: kanjo [options] [yyyymm]

Options:
  -o, --output   Set output format  [choices: "table", "text"] [default: "table"]
  -p, --profile  Set profile name (default: default)  [string] [default: "default"]
  -c, --config   Set config file path loading options  [string] [default: "$HOME/.kanjo"]
  --account      Set account id for billing  [string]
  --bucket       Set S3 bucket name storeing billing csv  [string]
  --region       Set S3 region name storeing billing csv  [string]
  --help         Show help  [boolean]
  --version      Show version number  [boolean]

Examples:
  kanjo                                               Show charges of current month
  kanjo 201507                                        Show charges of July, 2015
  kanjo --accont=foo --bucket=bar --region=us-east-1  No config file
```

![](http://i.imgur.com/1ZGtGtw.png)


## Related

- [kanjo](https://github.com/moqada/kanjo) - API for this module


## Todo

- [x] Load account / bucket info from config file
- [ ] Add tests
- [ ] Support weekly summary
- [ ] Support daily summary
- [ ] Support monthly forecast
- [ ] Support transition of charge in period


[npm-url]: https://www.npmjs.com/package/kanjo-cli
[npm-image]: https://img.shields.io/npm/v/kanjo-cli.svg?style=flat-square
[npm-download-url]: https://www.npmjs.com/package/kanjo-cli
[npm-download-image]: https://img.shields.io/npm/dt/kanjo-cli.svg?style=flat-square
[travis-url]: https://travis-ci.org/moqada/kanjo-cli
[travis-image]: https://img.shields.io/travis/moqada/kanjo-cli.svg?style=flat-square
[daviddm-url]: https://david-dm.org/moqada/kanjo-cli
[daviddm-image]: https://img.shields.io/david/moqada/kanjo-cli.svg?style=flat-square
[daviddm-dev-url]: https://david-dm.org/moqada/kanjo-cli#info=devDependencies
[daviddm-dev-image]: https://img.shields.io/david/dev/moqada/kanjo-cli.svg?style=flat-square
[license-url]: http://opensource.org/licenses/MIT
[license-image]: https://img.shields.io/npm/l/kanjo-cli.svg?style=flat-square
