![Image](https://raw.githubusercontent.com/MrDoomy/ChallengeEngineering/master/img/capture.png)

# Challenge Engineering

> *Web Scraping With Chrome HeadLess*

Projet JavaScript réalisé dans le cadre du *Challenge Engineering **Bankin'** n°1*, utilisant les technologies **NodeJS**, **NPM** (ou *Yarn*), ainsi que les dépendances *Puppeteer* et *NickJS* pour le navigateur **Chrome HeadLess**.

## Prérequis

*NickJS* se base sur la variable d'environnement **CHROME_PATH**, assurez-vous d'avoir ajouté cette variable avec les commandes suivantes en fonction de votre système d'exploitation.

 - Mac OS :

```
export CHROME_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
```

 - Windows :

```
set CHROME_PATH="C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
```

### Notes

La variable d'environnement **CHROME_PATH** peut être configurée grâce au package *Puppeteer* :

- Linux :

```
export CHROME_PATH="node_modules/puppeteer/.local-chromium/linux-<version>/chrome-linux/chrome"
```

Pour exécuter ce script sur **Linux** (*Debian* / *Ubuntu*), assurez-vous d'avoir les dépendances suivantes installées sur votre distribution :

<details>
<summary>apt-get install</summary>

```
gconf-service
libasound2
libatk1.0-0
libc6
libcairo2
libcups2
libdbus-1-3
libexpat1
libfontconfig1
libgcc1
libgconf-2-4
libgdk-pixbuf2.0-0
libglib2.0-0
libgtk-3-0
libnspr4
libpango-1.0-0
libpangocairo-1.0-0
libstdc++6
libx11-6
libx11-xcb1
libxcb1
libxcomposite1
libxcursor1
libxdamage1
libxext6
libxfixes3
libxi6
libxrandr2
libxrender1
libxss1
libxtst6
ca-certificates
fonts-liberation
libappindicator1
libnss3
lsb-release
xdg-utils
wget
```

</details>

## Fonctionnement

Ci-dessous la marche à suivre afin de lancer le proccesus de Web Scraping.

Récupérer le projet :

```
git clone https://github.com/MrDoomy/ChallengeEngineering.git
```

Placez vous dans le dossier :

```
cd ChallengeEngineering
```

Récupérer les dépendances :

```
npm install
```

Lancer le script :

```
npm start
```

### Sources

*Bankin'* : https://goo.gl/6CzEqU

*Chrome HeadLess* : https://goo.gl/wg3u1W

*NickJS* : https://goo.gl/Q5kvUe

*Puppeteer* : https://goo.gl/cz4fSi

### Licence

```
Copyright (C) 2018 Damien Chazoule

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
```
