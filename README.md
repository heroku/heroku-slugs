# Heroku Slugs CLI Plugin

This plugin adds commands to the Heroku CLI for downloading slugs

## To Install

```
$ heroku plugins:install heroku-slugs
```

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
