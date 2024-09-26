# manesuma
manage smartphone

# インストール方法
## 作業ディレクトリの作成
```
mkdir manesuma
```
## Git環境の構築
```
git init
git remote add origin git@github.com:vmtch/manesuma.git
git pull origin main
```
## Dockerイメージの生成
```
docker compose up --build
```
## nodeモジュールの作成
```
docker compose run node yarn install
```
## テストサーバーの起動
```
docker compose up -d
```
