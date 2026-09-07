# Account groups

## 概要

決算書表示名

## エンドポイント一覧

### POST /api/1/account_groups

操作: 決算書表示名の作成

説明: 概要 指定した事業所の決算書表示名（小カテゴリー）を作成する 決算書表示名は、貸借対照表・損益計算書などの決算書上で勘定科目をまとめて表示するための表示名です。勘定科目カテゴリー（中分類）の配下に作成され、勘定科目の作成・更新時に決算書表示名として指定できるようになります。 注意点 nameは同一年度内で一意である必要があります。すでに存在する決算書表示名と同じnameを指定した場合は400エラーになります。 account_category_idには、決算書表示名を配下に作成できる勘定科目カテゴリーのみ指定できます。指定可能な値はSelectablesフォーム用選択項目情報エンドポイント(account_groups.account_category_id)で取得してください。 indexを指定しない場合、決算書表示名は同一勘定科目カテゴリー内の末尾に追加されます。

### リクエストボディ

(必須)

- company_id (必須): integer(int64) - 事業所ID 例: `1`
- name (必須): string - 決算書表示名 (20文字以内)。同一年度内で一意である必要があります。末尾に半角スペースは指定できません。 例: `新しい決算書表示名`
- account_category_id (必須): integer(int64) - 勘定科目カテゴリーID。決算書表示名を配下に作成できる勘定科目カテゴリーのみ指定できます。指定可能な値はSelectablesフォーム用選択項目情報エンドポイント(account_groups.account_category_id)で取得可能です。指定できないIDの場合は400エラーになります。 例: `1`
- index (任意): integer(int64) - 表示順 (同一勘定科目カテゴリー内の挿入位置、0始まり)。指定した位置に挿入され、同一勘定科目カテゴリー内の他の決算書表示名の表示順は自動で振り直されます。未指定の場合や既存の決算書表示名の数を超える値を指定した場合は末尾に追加されます。 例: `1`

### レスポンス (201)

- account_group (必須): object - 作成された決算書表示名（小カテゴリー）
  - company_id (必須): integer(int64) - 事業所ID 例: `1`
  - id (必須): integer(int64) - 決算書表示名(小カテゴリー)ID 例: `1`
  - name (必須): string - 決算書表示名 例: `新しい決算書表示名`
  - account_structure_id (必須): integer(int64) - 年度ID 例: `1`
  - account_category_id (必須): integer(int64) - 勘定科目カテゴリーID 例: `1`
  - index (必須): integer(int64) - 表示順 (同一勘定科目カテゴリー内、0始まり) 例: `1`



## 参考情報

- freee API公式ドキュメント: https://developer.freee.co.jp/docs
- OpenAPIスキーマ: [accounting-api-schema.json](../../openapi/accounting-api-schema.json)
