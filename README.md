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
npm install --global kanjo
```


## Configuration

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


## Usage

```
Usage: kanjo [options] [yyyymm]

Options:
  -f, --format  Set output format  [choices: "table", "text"] [default: "table"]
  --account     Set account id for billing  [string] [required]
  --bucket      Set S3 bucket name storeing billing csv  [string] [required]
  --region      Set S3 region name storeing billing csv  [string] [default: "ap-northeast-1"]
  --help        Show help  [boolean]
  --version     Show version number  [boolean]

Examples:
  kanjo --accont=foo --bucket=bar         Show charges of current month
  kanjo --accont=foo --bucket=bar 201507  Show charges of 2015/09
```

![](http://i.imgur.com/1ZGtGtw.png)


## Related

- [kanjo](https://github.com/moqada/kanjo) - API for this module


## Todo

- [ ] Add tests
- [ ] Support weekly summary
- [ ] Support daily summary
- [ ] Support monthly forecast
- [ ] Support transition of charge in period


[npm-url]: https://www.npmjs.com/package/kanjo-cli
[npm-image]: https://img.shields.io/npm/v/kanjo-cli.svg?style=flat-square
[npm-download-url]: https://www.npmjs.com/package/kanjo-cli
[npm-download-image]: https://img.shields.io/npm/dm/kanjo-cli.svg?style=flat-square
[travis-url]: https://travis-ci.org/moqada/kanjo-cli
[travis-image]: https://img.shields.io/travis/moqada/kanjo-cli.svg?style=flat-square
[daviddm-url]: https://david-dm.org/moqada/kanjo-cli
[daviddm-image]: https://img.shields.io/david/moqada/kanjo-cli.svg?style=flat-square
[daviddm-dev-url]: https://david-dm.org/moqada/kanjo-cli#info=devDependencies
[daviddm-dev-image]: https://img.shields.io/david/dev/moqada/kanjo-cli.svg?style=flat-square
[license-url]: http://opensource.org/licenses/MIT
[license-image]: https://img.shields.io/npm/l/kanjo-cli.svg?style=flat-square
