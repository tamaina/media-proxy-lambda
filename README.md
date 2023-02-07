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
|モード|一から作成|
|関数名|media-proxy|
|アーキテクチャ|arm64|
|詳細設定/関数URLを有効化|true|
|認証タイプ|NONE|
|オリジン間リソース共有を設定|false|

## 4. 関数URLの動作確認
関数が作成されたら、**関数 URL**のon.awsで終わるリンクにアクセスし、`Hello from Lambda!`と表示されることを確認してください。

## 5. 環境変数を設定
設定 → 環境変数 → 編集 → 環境変数の追加を選択し、

```
キー / 値
NODE_ENV / production
```

と入力し保存してください。

## 6. git clone
git clone https://github.com/tamaina/media-proxy-lambda.git

## 7. npm install

```
npm install --target_arch=arm64 --target_platform=linux
```

## 8. デプロイ
```
FUNCTION_NAME=media-proxy npm run deploy
```

リージョンをaws configureで設定したリージョンではないものに指定するには、AWS_DEFAULT_REGIONまたはAWS_REGIONとして環境変数で指定してください。
