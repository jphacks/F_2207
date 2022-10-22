# タイムカプセルアプリ　リカプセル

[![IMAGE ALT TEXT HERE](https://jphacks.com/wp-content/uploads/2022/08/JPHACKS2022_ogp.jpg)](https://www.youtube.com/watch?v=LUPQFB4QyVo)

## 製品概要

### 背景(製品開発のきっかけ、課題等）

私たちの日常には、些細だけれど、でも思い返すと大切な思い出がたくさんあります。そして、そんな思い出のある場所は、他の人にとっては何の変哲もない場所であったとしても、自分にとっては特別な場所になり得ます。

しかし、日常の中にある思い出は、全てを覚えておくことはできません。時間の経過とともに忘れてしまうことの方が多いです。そして、そんな思い出を一緒に作ったはずの友達もまた、ライフステージや環境の変化で離れてしまっていることが場合があります。

タイムカプセルアプリ「**リカプセル**」は **思い出 x Tech** サービスです。 日々の中にある素敵な記憶を思い出させると同時に、一度は失われてしまったコミュニケーションのきっかけを提供します。

### 製品説明（具体的な製品の説明）

サービスの流れは大きく３ステップ。

1. 埋める

   その日の思い出を写真とともに埋めることができます。

   - 代表者が、カプセルの色とその日の思い出を表す絵文字を 1 文字選ぶ
   - 近くにいる友達とマッチングして、一緒に制作
   - お互いに知られないように写真を登録
   - カプセルのタイトルや開ける日、メモを記録

2. 待つ

   地図上で、どこの思い出がいつ開けられるかを見ることができます。

3. 掘り起こす

   みんなで集まってタイムカプセルを開封しましょう！

   - AR 上でカプセルを探索
   - 発見
   - スマホを振ってカプセルを開封
   - みんなの入れた写真やメモを見ることができる

### 特長

#### 1. その場にいるメンバーだけが参加できる

その日その場所にいたメンバーだけの、素敵な思い出を残せます。

#### 2. お互いが入れた写真は開封までわからない

みんながどんな写真を入れたのかは開封までのお楽しみです。

#### 3. もう一度みんなが集まることで開封できる

集まらないと開けられないことで、一度は離れてしまった友達と再びコミュニケーションを取るきっかけとなります。

### 解決出来ること

- 思い出、特に日常の些細な出来事を忘れてしまう
  - タイムカプセルの存在、そしてその中に入れられたたくさんの写真が、時間の経過とともに忘れてしまった素敵な日常の思い出を思い出させます
- 学校の卒業など、ライフステージの変化で友達と会わなくなってしまう
  - 「タイムカプセル開けようよ！」が、旧友と再びコミュニケーションを取るきっかけになります

### 今後の展望

- カプセルが開けられるようになった際の通知
- AR 画面における 3D モデルのブラッシュアップ
- カプセルを埋める・掘り起こす際に動画を撮れるようにする

### 注力したこと（こだわり等）

- チームメンバーにデザイナーを迎え入れ、細部の UI にもこだわることで、「エモさ」を演出
- AR を用いた表現や端末を振るという動作を取り入れることで、「楽しさ」を演出

## 開発技術

### 活用した技術

#### API・データ

- MapQuest
- MapBox
- 国土交通省地理院地図

#### フレームワーク・ライブラリ・モジュール

- React
- Next.js
- tailwind
- Mantine
- Three.js
- Firebase

### 独自技術

#### ハッカソンで開発した独自機能・技術

- 全てのコードはハッカソン期間中に書いています(事前開発は行っていません)
- 加速度検知
- GPS による近接判定
- スマホの姿勢センサとカメラ映像を組み合わせた location-based の AR
- Firestore を利用した入力項目のリアルタイム同期
