## アプリケーション概要
ペットでつながるSNSサービス「Coopet」です。ペットの画像投稿とその画像へのコメントを通じて交流を図ります。<br>
インスタグラムと違い、ペット(動物)にフォーカスしたSNSです。

## アプリケーションの機能一覧
・ログイン機能(SNS(Google・Twitter）によるログインと匿名ログインが可能になっています)<br>
・画像投稿機能<br>
・画像閲覧機能<br>
・コメント機能<br>
※匿名ログインでは画像投稿機能は利用できません<br>

## アプリケーション内で使用している技術一覧

### フロントエンド
- React
  * Redux
  * Material-UI
  * redux-saga
  * redux-logger
  
### サーバーサイド
- Firebase
  * Authentication
  * Database(Realtime Database)
    + ユーザー情報保存
  * Storage
    + 画像保存

### ビルド&デプロイ
- Circle CI
