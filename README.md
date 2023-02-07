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
|ランタイム|Node.js 18.x|
|アーキテクチャ|arm64|
|詳細設定/関数URLを有効化|true|
|認証タイプ|NONE|
|オリジン間リソース共有(CORS)を設定|true|

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

## 9. Cloudflareの設定
コスト節約や応答速度の向上のためには、CloudflareやCloudfrontなどのCDNでキャッシュを設定するべきです。

インスタンスのCDN/DNSをCloudflareに設定している場合が多いかと思いますので、今回はCloudflareでメディアプロキシを公開します。

まず、次の内容でCloudflare Workersのサービスを作成してください。  
サービス画面に移動し、クイック編集（Quick Edit）でワーカーの編集ができます。

```
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    url.host = '/* AWS Lambdaの関数URLのホスト名を入力（https://は含めない） */';
    return fetch(url);
  }
}
```

トリガータブに移動し、カスタムドメインを追加します。インスタンスのサブドメインが良いかと思います。  
（ここではmediaproxy.example.comで公開するものとします。）

カスタムドメインの適用には1時間程度〜最大24時間程度かかります。

### 10. Misskeyのdefault.ymlに追記

mediaProxyの指定をdefault.ymlに追記し、Misskeyを再起動してください。

```yml
mediaProxy: https://mediaproxy.example.com
```
