# TRC Ninja Front-End (trcninja-fe)
Based on Dash Ninja By Alexandre (aka elbereth) Devilliers

Check the running live website at [https://overview.terracoin.io]

This is part of what makes the TRC Ninja monitoring application.
It contains:
- Public REST API (using PHP and Phalcon framework)
- Public web pages (using static HTML5/CSS/Javascript)

## Requirement:
* You will need a running website, official at https://overview.terracoin.io uses apache2

For the REST API:
* PHP v5.6 with mysqli (works/tested with PHP 7.1)
* Phalcon v2.0.x (should work with any version) up to v3.2.x
* MySQL database with TRC Ninja Database (check trcninja-db repository)

## Optional:
* TRC Ninja Control script installed and running (to have a populated database)

## Install:
* Go to the root of your website for TRC monitoring (ex: cd /var/www/trcninja/)
* Get latest code from github:
```shell
git clone https://github.com/terracoin/trcninja-fe.git
```

* Configure php to answer only to calls to api/index.php rewriting to end-point api/

* Add api/cron.php script to your crontab, activate for main and/or test net, both for blocks24h and for masternode full list

## Configuration:
* Todo...
