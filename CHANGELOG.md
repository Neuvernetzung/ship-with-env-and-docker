# [1.3.0](https://github.com/Neuvernetzung/ship-with-env-and-docker/compare/v1.2.5...v1.3.0) (2023-05-06)

## 2.2.0

### Minor Changes

- 8151134: Weiterleitungen hinzufügen, statt mehrere URLs #218

### Patch Changes

- f315921: Deps updaten #222

## 2.1.2

### Patch Changes

- ebc75b9: Header für Readme hinzufügen #201
- b91082c: Log Volumes entfernen bei nginx usw. #198
- 77037c1: Log Volumes entfernen bei nginx usw. #198
- e947db2: Zurück zu nodenext moduleResolution #212
- c54fb22: 3rd Level Domains entfernen #186

## 2.1.1

### Patch Changes

- 8914954: revert: tsconfig anpassen #202

## 2.1.0

### Minor Changes

- d3d17ca: tsconfig anpassen #202

## 2.0.7

### Patch Changes

- 87d11d1: Node zu 20 updaten #197

## 2.0.6

### Patch Changes

- 66825e4: zodType hinzufügen für sharedDockerVolumes #193

## 2.0.5

### Patch Changes

- b3f1d0f: Map durch reduce ersetzen bei sharedDockerVolumes #190

## 2.0.4

### Patch Changes

- 4cea946: Möglichkeit Volumen zu Docker-Compose File hinzuzufügen #187

## 2.0.3

### Patch Changes

- 66449c2: CLI zum prüfen in GitHub Actions, ob Secrets enthalten sind in deploys #181

## 2.0.2

### Patch Changes

- 84fc568: Deps updaten #175
- 4687a4e: Wenn Passwort ARG übergeben, dann nicht nach Passwort fragen #174

## 2.0.1

### Patch Changes

- d364084: Wait-on in deploys definierbar #170

## 2.0.0

### Major Changes

- 4bc1d36: Neue Projektstruktur v2 #164

### Patch Changes

- ff63fc1: Tasks reduzieren #166

## 1.5.4

### Patch Changes

- 66857d3: node_modules wird in app artifact nicht mit übertragen #156
- fea2a00: nginx http2 eigenes directive #154

## 1.5.3

### Patch Changes

- 261013c: Packagepath pro App erstellen, nicht pro Server #150

## 1.5.2

### Patch Changes

- bddfb1a: Wenn kein default Docker Image verwendet, dann default Docker Schritte nicht ausführen #145

## 1.5.1

### Patch Changes

- 1875915: DockerFileInstructions Enum durch Arraytype ersetzen #141

## 1.5.0

### Minor Changes

- 7baa09c: Möglichkeit artifacts auf apps aufzusplitten #136
- c70c08d: Bei Verschlüsselung nur die envs und server daten verschlüsseln. #64

## 1.4.3

### Patch Changes

- dd06a8c: exit entfernen

## 1.4.2

### Patch Changes

- ec1cff2: Node_module package paths nicht mit kopieren #131

## 1.4.1

### Patch Changes

- eff8f57: Package.json nicht für jedes Dir versuchen zu kopieren in packagePaths, sondern nur wenn vorhanden #125
- 9fdb223: Benötigte Zeit bei Erfolg ausgeben #123
- a7c3521: Tar Logs nur bei verbose Mode #124

## 1.4.0

### Minor Changes

- 176b4d8: Definierte Volumes zusammenfassen und in neverClean verwenden. Optional cleanVolume option in docker hinzufügen #115
- c843e36: Nur spezifischen Deploy ausführen, da skip dies nicht abdeckt #89
- 197d298: Docker Package.json kopieren nur, welche auch übertragen wurden #114
- fbe9f35: Packages kopieren und Install optional #113
- d3d944b: Optional: remove Orphans bei docker-compose #88

### Features

- **docker:** Docker command hinzufügen [#109](https://github.com/Neuvernetzung/ship-with-env-and-docker/issues/109) ([c06a34b](https://github.com/Neuvernetzung/ship-with-env-and-docker/commit/c06a34b6cae0a2bdaf0e93baac022b6a3cf7cc8c))
- **docker:** Docker Port zu Array ändern [#108](https://github.com/Neuvernetzung/ship-with-env-and-docker/issues/108) ([43b5be0](https://github.com/Neuvernetzung/ship-with-env-and-docker/commit/43b5be000ceab187acd56f93978624cbb48c472f))

## [1.2.5](https://github.com/Neuvernetzung/ship-with-env-and-docker/compare/v1.2.4...v1.2.5) (2023-05-05)

### Bug Fixes

- **build:** Generierung der node_modules Paths wiederherstellen zu 1.2.0 [#105](https://github.com/Neuvernetzung/ship-with-env-and-docker/issues/105) ([9a9a6b7](https://github.com/Neuvernetzung/ship-with-env-and-docker/commit/9a9a6b7a66345f9100aa574cad141477a8b971d8))

## [1.2.4](https://github.com/Neuvernetzung/ship-with-env-and-docker/compare/v1.2.3...v1.2.4) (2023-05-05)

### Bug Fixes

- **build:** package.json usw wird doppelt in Tar gepackt [#102](https://github.com/Neuvernetzung/ship-with-env-and-docker/issues/102) ([e02f8e1](https://github.com/Neuvernetzung/ship-with-env-and-docker/commit/e02f8e11798ab0ced44fb64c86a1354d6a8f9d20))

## [1.2.3](https://github.com/Neuvernetzung/ship-with-env-and-docker/compare/v1.2.2...v1.2.3) (2023-05-05)

### Bug Fixes

- **docker:** Node_module package.jsons entfernen in Docker Copy, falls erlaubt in Artefakt [#99](https://github.com/Neuvernetzung/ship-with-env-and-docker/issues/99) ([520eb16](https://github.com/Neuvernetzung/ship-with-env-and-docker/commit/520eb16992d65a91fad8644fc153099a35e116aa))

## [1.2.2](https://github.com/Neuvernetzung/ship-with-env-and-docker/compare/v1.2.1...v1.2.2) (2023-05-05)

### Bug Fixes

- **build:** process.exit entfernen [#96](https://github.com/Neuvernetzung/ship-with-env-and-docker/issues/96) ([d7cb0e4](https://github.com/Neuvernetzung/ship-with-env-and-docker/commit/d7cb0e47ed5f58aea6e34b1e278b9a174ecc655d))

## [1.2.1](https://github.com/Neuvernetzung/ship-with-env-and-docker/compare/v1.2.0...v1.2.1) (2023-05-05)

### Bug Fixes

- **build:** Tar Ignore fixen [#91](https://github.com/Neuvernetzung/ship-with-env-and-docker/issues/91) ([a0c6746](https://github.com/Neuvernetzung/ship-with-env-and-docker/commit/a0c67466544b7d01478568ab57c77ac539ab48de))
- **deps:** yaml updaten [#93](https://github.com/Neuvernetzung/ship-with-env-and-docker/issues/93) ([6a2b5dd](https://github.com/Neuvernetzung/ship-with-env-and-docker/commit/6a2b5dda573d8a397d6331d68304bb3f854a985c))

# [1.2.0](https://github.com/Neuvernetzung/ship-with-env-and-docker/compare/v1.1.16...v1.2.0) (2023-03-28)

### Bug Fixes

- **types:** ZUrl transformiert falsch, außerdem zUrl exposen [#81](https://github.com/Neuvernetzung/ship-with-env-and-docker/issues/81) ([c76a68e](https://github.com/Neuvernetzung/ship-with-env-and-docker/commit/c76a68eeeed44f85bd2268c589ea0e51bd1ad2e1))

### Features

- **docker:** Timeout bei Docker-compose erhöhen [#82](https://github.com/Neuvernetzung/ship-with-env-and-docker/issues/82) ([cd0463c](https://github.com/Neuvernetzung/ship-with-env-and-docker/commit/cd0463cdc4b61fd4743208fd54d8391bbe3bc5ad))
- **tar:** Generell node_modules skippen [#80](https://github.com/Neuvernetzung/ship-with-env-and-docker/issues/80) ([af54884](https://github.com/Neuvernetzung/ship-with-env-and-docker/commit/af548842f45219898e0f315341bb945c2d90fe96))
- **wait:** Wait-on Task in Production mit Output [#79](https://github.com/Neuvernetzung/ship-with-env-and-docker/issues/79) ([d4de2a3](https://github.com/Neuvernetzung/ship-with-env-and-docker/commit/d4de2a3f60ff6d56e1fd881d5ac5044f75839a7b))

## [1.1.16](https://github.com/Neuvernetzung/ship-with-env-and-docker/compare/v1.1.15...v1.1.16) (2023-03-28)

### Bug Fixes

- **prepare:** Apt-get upgrade -y nicht noninteractive [#73](https://github.com/Neuvernetzung/ship-with-env-and-docker/issues/73) ([a06f655](https://github.com/Neuvernetzung/ship-with-env-and-docker/commit/a06f655325d58ef3ff78279376930a9c3777c64c))
- **transfer:** Verbose output für transfer Artifact [#74](https://github.com/Neuvernetzung/ship-with-env-and-docker/issues/74) ([ab42618](https://github.com/Neuvernetzung/ship-with-env-and-docker/commit/ab42618083b72b98c4d6131c26dfa5ee94263af7))

## [1.1.15](https://github.com/Neuvernetzung/ship-with-env-and-docker/compare/v1.1.14...v1.1.15) (2023-03-24)

### Bug Fixes

- **dev:** Open Prefixen mit http:// [#68](https://github.com/Neuvernetzung/ship-with-env-and-docker/issues/68) ([62d87e1](https://github.com/Neuvernetzung/ship-with-env-and-docker/commit/62d87e183c88c70d6d781c789f54b4117ad994da))
- **prepare:** NeverClean löscht zwar den Ordner nicht, aber dafür die Unterordner [#69](https://github.com/Neuvernetzung/ship-with-env-and-docker/issues/69) ([c63689a](https://github.com/Neuvernetzung/ship-with-env-and-docker/commit/c63689ab2c665c572e00306eb918349dd53fba63))

## [1.1.14](https://github.com/Neuvernetzung/ship-with-env-and-docker/compare/v1.1.13...v1.1.14) (2023-03-15)

### Bug Fixes

- **workdir:** Workdir Path gefixt und Conditional bei neverClean gefixt [#65](https://github.com/Neuvernetzung/ship-with-env-and-docker/issues/65) ([7eac5b9](https://github.com/Neuvernetzung/ship-with-env-and-docker/commit/7eac5b9f0ae5a8a64eadedd5d4659a76dd10ed25))

## [1.1.13](https://github.com/Neuvernetzung/ship-with-env-and-docker/compare/v1.1.12...v1.1.13) (2023-03-11)

### Bug Fixes

- **node:** ExecaCommand zurück zu execa mit shell für node prozesse [#61](https://github.com/Neuvernetzung/ship-with-env-and-docker/issues/61) ([9b35739](https://github.com/Neuvernetzung/ship-with-env-and-docker/commit/9b35739654e52cd2e634f9ea996447a275c7abea))

## [1.1.12](https://github.com/Neuvernetzung/ship-with-env-and-docker/compare/v1.1.11...v1.1.12) (2023-03-10)

### Bug Fixes

- **exec:** ExecaCommand statt execa nutzen [#58](https://github.com/Neuvernetzung/ship-with-env-and-docker/issues/58) ([d2c0e4f](https://github.com/Neuvernetzung/ship-with-env-and-docker/commit/d2c0e4f11e908dc7e50038ed87e4aaa44d1c4176))

## [1.1.11](https://github.com/Neuvernetzung/ship-with-env-and-docker/compare/v1.1.10...v1.1.11) (2023-03-10)

### Bug Fixes

- **ssh:** NeverClean funktioniert nun mit mehreren paths [#54](https://github.com/Neuvernetzung/ship-with-env-and-docker/issues/54) ([c018398](https://github.com/Neuvernetzung/ship-with-env-and-docker/commit/c0183981702d1c421d574eedeab373cab15a2467))
- **ssh:** OnStderr ebenfalls loggen ([7f2b910](https://github.com/Neuvernetzung/ship-with-env-and-docker/commit/7f2b910e73b509f05c0d9027afd10043e44a182a))

## [1.1.10](https://github.com/Neuvernetzung/ship-with-env-and-docker/compare/v1.1.9...v1.1.10) (2023-03-10)

### Bug Fixes

- **ssh:** Nach Test - ssh dispose ([bd2c4fd](https://github.com/Neuvernetzung/ship-with-env-and-docker/commit/bd2c4fd36bad8766a32bfa7103f3818c8a31ad82))

## [1.1.9](https://github.com/Neuvernetzung/ship-with-env-and-docker/compare/v1.1.8...v1.1.9) (2023-03-09)

### Bug Fixes

- **whatever:** GitHub Actions Workaround [#45](https://github.com/Neuvernetzung/ship-with-env-and-docker/issues/45) ([4c2cf69](https://github.com/Neuvernetzung/ship-with-env-and-docker/commit/4c2cf69404ac7454664f9a2844f148659d4d33dc))

## [1.1.8](https://github.com/Neuvernetzung/ship-with-env-and-docker/compare/v1.1.7...v1.1.8) (2023-03-09)

### Bug Fixes

- **exec:** RunNodeProcess stderr ebenfalls pipen [#45](https://github.com/Neuvernetzung/ship-with-env-and-docker/issues/45) ([9356c87](https://github.com/Neuvernetzung/ship-with-env-and-docker/commit/9356c87d5f4621479454f96dac214b4cfc20d890))

## [1.1.7](https://github.com/Neuvernetzung/ship-with-env-and-docker/compare/v1.1.6...v1.1.7) (2023-03-09)

### Bug Fixes

- **docker:** Sichergehen, dass alle dir Pfade in Dockerfile mit / aufhören [#40](https://github.com/Neuvernetzung/ship-with-env-and-docker/issues/40) ([9c488d6](https://github.com/Neuvernetzung/ship-with-env-and-docker/commit/9c488d61ab385704e17d509663c83e157a7f3364))
- **nginx:** Bei verknüpfter nginx Url dockerComposeServiceName nutzen [#41](https://github.com/Neuvernetzung/ship-with-env-and-docker/issues/41) ([9df044c](https://github.com/Neuvernetzung/ship-with-env-and-docker/commit/9df044c77272600a2f98620ad3a5e56d239d5f1f))

## [1.1.6](https://github.com/Neuvernetzung/ship-with-env-and-docker/compare/v1.1.5...v1.1.6) (2023-03-09)

### Bug Fixes

- **docker:** Docker file issues beheben [#37](https://github.com/Neuvernetzung/ship-with-env-and-docker/issues/37) ([37d53ee](https://github.com/Neuvernetzung/ship-with-env-and-docker/commit/37d53ee7fd58310dfa032207f2defd230eef2ecd))

## [1.1.5](https://github.com/Neuvernetzung/ship-with-env-and-docker/compare/v1.1.4...v1.1.5) (2023-03-09)

### Bug Fixes

- **docker:** Relativen Pfad nutzen für Docker packages.json [#32](https://github.com/Neuvernetzung/ship-with-env-and-docker/issues/32) ([345b73b](https://github.com/Neuvernetzung/ship-with-env-and-docker/commit/345b73be089d33f32f14fb9741a7a9b7ae176581))

## [1.1.4](https://github.com/Neuvernetzung/ship-with-env-and-docker/compare/v1.1.3...v1.1.4) (2023-03-09)

### Bug Fixes

- **docker:** Dockerfile Package.json glob kopieren in dirname statt . [#32](https://github.com/Neuvernetzung/ship-with-env-and-docker/issues/32) ([370af52](https://github.com/Neuvernetzung/ship-with-env-and-docker/commit/370af524716f6c0152835ce26a84a78d9d24b940))

## [1.1.3](https://github.com/Neuvernetzung/ship-with-env-and-docker/compare/v1.1.2...v1.1.3) (2023-03-09)

### Bug Fixes

- **run:** In Compose File Leerzeichen des Namens durch "-" ersetzen [#28](https://github.com/Neuvernetzung/ship-with-env-and-docker/issues/28) ([60fe66e](https://github.com/Neuvernetzung/ship-with-env-and-docker/commit/60fe66ee696a1cb51056d383e7953dd064e30319))

## [1.1.2](https://github.com/Neuvernetzung/ship-with-env-and-docker/compare/v1.1.1...v1.1.2) (2023-03-09)

### Bug Fixes

- **init:** Config Boilerplate anpassen [#22](https://github.com/Neuvernetzung/ship-with-env-and-docker/issues/22) ([935e7e5](https://github.com/Neuvernetzung/ship-with-env-and-docker/commit/935e7e58226adcee5865f034d2657016b89a810d))
- **logs:** Error handling bei Zod-Errors fixen [#24](https://github.com/Neuvernetzung/ship-with-env-and-docker/issues/24) ([d22e796](https://github.com/Neuvernetzung/ship-with-env-and-docker/commit/d22e796b1c34e5d7abfd84a4d28c910240e6a428))

## [1.1.1](https://github.com/Neuvernetzung/ship-with-env-and-docker/compare/v1.1.0...v1.1.1) (2023-03-08)

### Bug Fixes

- **types:** Export types [#19](https://github.com/Neuvernetzung/ship-with-env-and-docker/issues/19) ([b20f35c](https://github.com/Neuvernetzung/ship-with-env-and-docker/commit/b20f35cb6cf77e3d9c7257b03a669f2991237cbe))

# [1.1.0](https://github.com/Neuvernetzung/ship-with-env-and-docker/compare/v1.0.0...v1.1.0) (2023-03-08)

### Features

- **enc:** Verschlüsselung granular gestalten [#16](https://github.com/Neuvernetzung/ship-with-env-and-docker/issues/16) ([4cf9708](https://github.com/Neuvernetzung/ship-with-env-and-docker/commit/4cf9708445ec6e0a21dc00df3b68236de6ed950d))

# 1.0.0 (2023-03-07)

### Bug Fixes

- **ci:** Rm .npmrc aus Workflow entfernen [#8](https://github.com/Neuvernetzung/ship-with-env-and-docker/issues/8) ([98f4fff](https://github.com/Neuvernetzung/ship-with-env-and-docker/commit/98f4fffd58afedef60615b4e0deed1f0519d7aa7))
- **deps:** Semantic Release deps hinzufügen [#11](https://github.com/Neuvernetzung/ship-with-env-and-docker/issues/11) ([472f4af](https://github.com/Neuvernetzung/ship-with-env-and-docker/commit/472f4af6fd113ef68f5935b6a21f3c67e95f905a))
- **deps:** Semantic Release deps hinzufügen [#11](https://github.com/Neuvernetzung/ship-with-env-and-docker/issues/11) ([bd3d3d0](https://github.com/Neuvernetzung/ship-with-env-and-docker/commit/bd3d3d09e783d76a02975dc11c01656b426019d4))

### Features

- **args:** Passwort Argument hinzugefügt [#4](https://github.com/Neuvernetzung/ship-with-env-and-docker/issues/4) ([b6bc0a4](https://github.com/Neuvernetzung/ship-with-env-and-docker/commit/b6bc0a466cec297db5ab22fd3f59e9023d774870))
- **ci:** Release Workflow hinzufügen [#6](https://github.com/Neuvernetzung/ship-with-env-and-docker/issues/6) ([7bad526](https://github.com/Neuvernetzung/ship-with-env-and-docker/commit/7bad526bdff2e2725d2f58247128460beaca4a22))
