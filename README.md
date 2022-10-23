## ご指摘箇所の修正と、未完了箇所の実装
- csrf対策
-   app.jsに記述し（DRY）、ページが増えても対応できるように修正
- ログイン成功後のリダイレクト設定
-   app.jsに記述し（DRY）、ログイン成功時にsession内のリダイレクト設定値をリセット
- パスワードのハッシュ化
-   bcryptを使用
- バリデーション
-   express-vlidatorを使用
- パスワードリセット機能
-   登録したメールアドレス宛にメールを送信し、トークン情報を載せたURLリンクよりパスワード再設定画面に遷移する仕様

## ◇作成画面
- ユーザーアカウント作成画面　/users/new/
- ログイン画面　/users/login/
- ログイン成功後の画面　/
- ログイン後に閲覧可能な画面　/users/
- パスワード確認画面(未完)　/users/forget-pass

## ◇使用技術・パッケージ
- node.js（16.17.1）
- Express（4.16.1）
- ORM：sequelize（6.24.0）
- DB：sqlite3
- ejs
- express-session
- csurf
- nodemailer

## ◇理解出来ていない箇所
- sessionのオプション設定箇所
- models/index.js内の記述

## ◇実装できなかった箇所
- 機能１−４　ユーザがパスワードを忘れた場合の仕様を考え、機能を作成<br>nodemailerを使用しローカルからメールが送られるようにしたかったが、メールが送信されない問題を解決する時間を持てなかった
- パスワードのハッシュ化や、アカウント登録時のバリデーションは実装した方がいいと思いました。質問をして確認するべきだったと思います

## ◇取り組み方
- node.js/Expressの学習には参考書を使用しました。（https://www.shuwasystem.co.jp/book/9784798062433.html）
- 実装にあたっては参考書のコードをただコピペするのではなく、作成したい画面や機能を元に、流れを理解することを意識して進めました。
