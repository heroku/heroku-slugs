# Heroku Slugs CLI Plugin

This plugin adds commands to the Heroku CLI for downloading slugs

## Commands

```
$ heroku slugs -a appname
Slugs in appname
v24: 00000000-bbbb-cccc-dddd-eeeeeeeeeeee
v23: 11111111-bbbb-cccc-dddd-eeeeeeeeeeee
v22: 22222222-bbbb-cccc-dddd-eeeeeeeeeeee
v21: 33333333-bbbb-cccc-dddd-eeeeeeeeeeee

$ heroku slugs:download 00000000-bbbb-cccc-dddd-eeeeeeeeeeee -a appname
```

This will download the Slug directly from our filestore on S3

## Using a proxy

```
$ export HEROKU_HTTP_PROXY_HOST=<your-proxy-host>
$ export HEROKU_HTTP_PROXY_PORT=<your-proxy-port>
$ heroku slugs:download 00000000-bbbb-cccc-dddd-eeeeeeeeeeee -a appname
```

<!-- toc -->
* [Heroku Slugs CLI Plugin](#heroku-slugs-cli-plugin)
* [Usage](#usage)
* [Commands](#commands)
* [Command Topics](#command-topics)
<!-- tocstop -->

# Usage
  <!-- usage -->
```sh-session
$ npm install -g @heroku-cli/heroku-slugs
$ heroku COMMAND
running command...
$ heroku (--version)
@heroku-cli/heroku-slugs/3.0.3 linux-x64 node-v22.23.2
$ heroku --help [COMMAND]
USAGE
  $ heroku COMMAND
...
```
<!-- usagestop -->

# Commands
  <!-- commands -->
# Command Topics

* [`heroku slugs`](docs/slugs.md) - manage and download slugs

<!-- commandsstop -->
