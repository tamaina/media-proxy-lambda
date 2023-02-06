# Media Proxy for Misskey on AWS Lambda
## 1. AWS IAM アクセスキーの生成
AWS CLIで使うためのアクセスIDとシークレットアクセスキーを生成します。

https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html#Using_CreateAccessKey

## 2. AWS CLIのインストールと設定
次のドキュメントの「前提条件」から、AWS CLIのインストールと`aws configure`でのクイック設定を行ないます。

https://docs.aws.amazon.com/lambda/latest/dg/nodejs-package.html

## 3. AWS Lambda関数を作る
https://console.aws.amazon.com/lambda/home#/functions にアクセスします。

リージョンが自分の想定しているものかどうかを確認します。

「関数の作成」を選択し、関数の作成操作を行なってください。

### おすすめの設定

|項目|値|
|:-|:-|
|関数名|media-proxy|
|アーキテクチャ|arm64|
|詳細設定/関数URLを有効化|true|
|認証タイプ|NONE|
|オリジン間リソース共有を設定|false|

## 4. git clone
git clone https://github.com/tamaina/media-proxy-lambda.git

## 5. npm install

```
npm install --target_arch=arm64 --target_platform=linux
```

## 6. Deploy

```
FUNCTION_NAME=media-proxy npm run deploy
```
