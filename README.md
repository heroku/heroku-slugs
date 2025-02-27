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
<!-- tocstop -->

# Usage
  <!-- usage -->
```sh-session
$ heroku plugins:install @heroku-cli/heroku-slugs
$ heroku COMMAND
running command...
...
```
<!-- usagestop -->

# Commands
  <!-- commands -->
* [`heroku slugs`](#heroku-slugs)
* [`heroku slugs:download [SLUG]`](#heroku-slugsdownload-slug)

## `heroku slugs`

list recent slugs on application

```
USAGE
  $ heroku slugs -a <value> [-r <value>]

FLAGS
  -a, --app=<value>     (required) app to run command against
  -r, --remote=<value>  git remote of app to use

DESCRIPTION
  list recent slugs on application

EXAMPLES
  $ heroku slugs --app myapp
```

_See code: [src/commands/slugs/index.ts](https://github.com/heroku/heroku-slugs/blob/v2.0.0/src/commands/slugs/index.ts)_

## `heroku slugs:download [SLUG]`

download a slug's tarball to <APP_NAME>/slug.tar.gz and then extract the slug

```
USAGE
  $ heroku slugs:download [SLUG] -a <value> [-e] [-r <value>]

ARGUMENTS
  SLUG  name or ID of slug

FLAGS
  -a, --app=<value>      (required) app to run command against
  -e, --no-extract-slug  skip extracting slug after download
  -r, --remote=<value>   git remote of app to use

DESCRIPTION
  download a slug's tarball to <APP_NAME>/slug.tar.gz and then extract the slug

EXAMPLES
  $ heroku slugs:download --app example-app v2

  $ heroku slugs:download --app example-app v2 --no-extract-slug
```

_See code: [src/commands/slugs/download.ts](https://github.com/heroku/heroku-slugs/blob/v2.0.0/src/commands/slugs/download.ts)_
<!-- commandsstop -->
