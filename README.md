## ◇作成画面
- ユーザーアカウント作成画面　/users/new/
- ログイン画面　/users/login/
- ログイン成功後の画面　/users/
- ログイン後に閲覧可能な画面　/
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
