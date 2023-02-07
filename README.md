# Media Proxy for Misskey on AWS Lambda

## X. Dockerでデプロイ
### X1. ローカルにDockerをインストール
DockerコンテナをAWS Lambdaにデプロイするには、Amazon ECRのプライベートリポジトリにコンテナをアップロードしてからダウンロードすることが必要です。  
DockerイメージをPushするために、最新のDockerをインストールしてください。

（作業はローカルでも良いですし、作業用のサーバーでも構いませんが、ここではローカルマシンと呼称することにします。）

### X2. AWS CLIのインストールと設定
1. [AWS CLIのインストール](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html)
2. [`aws configure`でのクイック設定](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html)

### X3. リポジトリを作成
https://console.aws.amazon.com/ecr/create-repository にアクセスし、Amazon ECRリポジトリの作成を開始します。  
まずは、自分が利用したいリージョンになっているか確認してください。ここではリージョンを`ap-northeast-1`として進めます。

|項目|値|
|:-|:-|
|可視性設定|プライベート|
|リポジトリ名|media-proxy|
|タグのイミュータビリティ|無効|
|イメージスキャンの設定|オン|
|暗号化設定|オフ|

### X4. docker login

作成したリポジトリを選択（リストの左端の○を選択）し、`プッシュコマンドの表示`を選択します。

`aws ecr get-login-password`から始まるコマンドをコピーし、ローカルマシンで実行してください。

また、コマンドの中にある12桁の数字（AWSのアカウントID. 例: 123456780123）、リージョンおよびリポジトリ名を元に、次のようにAmazon ECR イメージURIを表現できます。この`イメージURI`は後で使うので、メモしておいてください。

```
123456780123.dkr.ecr.ap-northeast-1.amazonaws.com/media-proxy:latest
```

### X5. Docker Pull
公開リポジトリからdocker pullします。

```
sudo docker pull public.ecr.aws/l3y5j5w2/media-proxy-lambda
```

pullしたリポジトリをプライベートリポジトリにタグ付けし、pushします。

```
docker tag media-proxy-lambda:latest イメージURI
docker push イメージURI
```

### X6. Lambda関数の作成
https://console.aws.amazon.com/lambda/home#/create/function?intent=authorFromImage を開いて、

|項目|値|
|:-|:-|
|モード|コンテナイメージ|
|関数名|media-proxy|
|コンテナイメージ URI|イメージURI|
|アーキテクチャ|arm64|

### X7. Lambda関数の設定
設定タブを開いてください。

#### X7.1. 一般設定
一般設定 → 編集 を選択し、次のように変更します。

|項目|値|
|:-|:-|
|メモリ|256MB|
|タイムアウト|16秒|

保存を選択します。

#### X7.2. 環境変数
環境変数 → 編集 → 環境変数の追加 を選択します。

|キー|値|
|:-|:-|
|NODE_ENV|production|

保存を選択します。

#### X7.2. 関数URL
関数URL → 関数URLを作成 を選択します。

|項目|値|
|:-|:-|
|認証タイプ|NONE|
|オリジン間リソース共有(CORS)を設定|true|
|許可認証情報|オン|

保存を選択します。

作成された関数URLのリンクにアクセスし、`Hello World!`と表示されるか確認してください。

### X8. 完了です
これでLambdaが動作するようになりました！

CDNの設定を続けてください。

## X9. アップデートするには
1. docker pull, docker tag, docker pushを行います。
2. Lambda関数のダッシュボードで 新しいイメージをデプロイ → 保存 と操作します。

## Y. zipアップロードでデプロイ

### Y1. AWS IAM アクセスキーの生成
AWS CLIで使うためのアクセスIDとシークレットアクセスキーを生成します。

https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html#Using_CreateAccessKey

### Y2. AWS CLIのインストールと設定
1. [AWS CLIのインストール](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html)
2. [`aws configure`でのクイック設定](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html)

https://docs.aws.amazon.com/lambda/latest/dg/nodejs-package.html

### Y3. AWS Lambda関数を作る
https://console.aws.amazon.com/lambda/home#/create/function?intent=authorFromScratch にアクセスし、Lambda関数を作成します。

リージョンが自分の想定しているものかどうかを確認します。

#### おすすめの設定

|項目|値|
|:-|:-|
|モード|一から作成|
|関数名|media-proxy|
|ランタイム|Node.js 18.x|
|アーキテクチャ|arm64|
|詳細設定/関数URLを有効化|true|
|認証タイプ|NONE|
|オリジン間リソース共有(CORS)を設定|true|

### Y4. 関数URLの動作確認
関数が作成されたら、**関数 URL**のon.awsで終わるリンクにアクセスし、`Hello from Lambda!`と表示されることを確認してください。

### Y5. Lambda関数の設定
設定タブを開いてください。

#### Y5.1. 一般設定
一般設定 → 編集 を選択し、次のように変更します。

|項目|値|
|:-|:-|
|メモリ|256MB|
|タイムアウト|16秒|

保存を選択します。

#### Y5.2. 環境変数
環境変数 → 編集 → 環境変数の追加 を選択します。

|キー|値|
|:-|:-|
|NODE_ENV|production|

保存を選択します。

### Y6. git clone
git clone https://github.com/tamaina/media-proxy-lambda.git

### Y7. npm install

```
npm install --target_arch=arm64 --target_platform=linux
```

### Y8. デプロイ
```
FUNCTION_NAME=media-proxy npm run deploy
```

リージョンをaws configureで設定したリージョンではないものに指定するには、AWS_DEFAULT_REGIONまたはAWS_REGIONとして環境変数で指定してください。

# CDNの設定
コスト節約や応答速度の向上のために、CloudflareやCloudfrontなどのCDNを使用しキャッシュを設定するべきです。

## A. Cloudfront

### A1. Cloudfrontのディストリビューションを作成
https://console.aws.amazon.com/cloudfront/v3/home#/distributions/create にアクセスし、Cloudfrontのディストリビューションを作成します。

|項目|値|
|:-|:-|
|オリジンドメイン|AWS Lambdaの関数URLのホスト名を入力（https://は含めない）|
|プロトコル|HTTPSのみ|
|...|...|
|キャッシュキーとオリジンリクエスト|Legacy cache settings|
|クエリ文字列|すべて|
|...|...|
|料金クラス|北米、欧州、アジア、中東、アフリカを使用|
|サポートされている HTTP バージョン|HTTP/2, HTTP/3|
|標準ログ記録|ともにオフ|
|説明|Misskey Media Proxy|

デプロイ（というか各DNSのキャッシュ期限切れ）には数分がかかるようですので、数分後にディストリビューションドメインにアクセスして`Hello World!`と表示されるか確認してください。

### A2. Misskeyのdefault.ymlに追記
mediaProxyの指定をdefault.ymlに追記し、Misskeyを再起動してください。

```yml
mediaProxy: https://~~~~~.cloudfront.net // ディストリビューションドメイン名を設定します
```

## B. Cloudflare
インスタンスのCDN/DNSをCloudflareに設定している場合が多いかと思いますので、Cloudflareでのメディアプロキシのキャッシュ方法もご紹介します。

**ただし、Freeプランでは1日10万リクエストまでしか処理できません。**  
ちょっと割に合わないので、Cloudfrontを使った方が賢明な気がします。

### B1. Cloudflare Workersのサービスを作成
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

### B2. サービスのカスタムドメインを設定
トリガータブに移動し、カスタムドメインを追加します。インスタンスのサブドメインが良いかと思います。  
（ここではmediaproxy.example.comで公開するものとします。）

カスタムドメインの適用には1時間程度〜最大24時間程度かかります。

### B3. Misskeyのdefault.ymlに追記
mediaProxyの指定をdefault.ymlに追記し、Misskeyを再起動してください。

```yml
mediaProxy: https://mediaproxy.example.com
```
