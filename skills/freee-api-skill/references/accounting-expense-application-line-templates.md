# Expense application line templates

## 概要

経費科目

## エンドポイント一覧

### GET /api/1/expense_application_line_templates

操作: 経費科目一覧の取得

説明: 概要 指定した事業所の経費科目一覧を取得する 経費科目は、経費申請の作成時に申請者が選択する項目で、勘定科目・税区分・品目などの組み合わせをあらかじめ設定したものです。 注意点 カスタム申請項目を含むなど、Web版freee会計専用の設定を含む経費科目も一覧には含まれます。ただし、これらの経費科目は経費科目の取得・更新APIでは404エラーになります。

### パラメータ

| 名前 | 位置 | 必須 | 型 | 説明 |
|------|------|------|-----|------|
| company_id | query | はい | integer(int64) | 事業所ID |
| offset | query | いいえ | integer(int64) | 取得レコードのオフセット (デフォルト: 0) |
| limit | query | いいえ | integer(int64) | 取得レコードの件数 (デフォルト: 20, 最小: 1, 最大: 100) |

### レスポンス (200)

- expense_application_line_templates (必須): array[object]
  配列の要素:
    - id (必須): integer(int64) - 経費科目ID 例: `1` (最小: 1)
    - source_line_template_id (必須): integer(int64) - 経費科目の元となるテンプレートを識別するID。経費科目の設定（名前や勘定科目など）を変更しても変わらない固定値 例: `1` (最小: 0)
    - name (必須): string - 経費科目名 例: `交通費`
    - account_item_id (必須): integer(int64) - 経費科目に紐づく勘定科目のID 例: `1` (最小: 1)
    - account_item_name (必須): string - 経費科目に紐づく勘定科目の名前 例: `旅費交通費`
    - tax_code (必須): integer(int64) - 経費科目に紐づく税区分コード 例: `1` (最小: 0, 最大: 2147483647)
    - tax_name (必須): string - 経費科目に紐づく税区分の名前 例: `課対仕入`
    - description (必須): string - 経費科目の説明。未設定の場合はnull 例: `電車、バス、飛行機などの交通費`
    - line_description (必須): string - 内容の補足。経費申請の作成時に内容欄へ何を入力すべきかを申請者に案内する文言。未設定の場合はnull 例: `移動区間`
    - required_receipt (必須): boolean - 添付ファイルの必須/任意（true: 経費申請の作成時に領収書などのファイル添付が必須, false: ファイル添付は任意） 例: `true`
    - custom_form_parts (任意): array[object] - カスタム申請項目
    - amount_setting (任意): string - 金額設定（none: なし, fix: 固定金額, expression: 計算式） (選択肢: none, fix, expression) 例: `expression`
    - rounding_setting (任意): string - 端数処理（round: 四捨五入, floor: 切り捨て, ceil: 切り上げ）。金額設定が計算式以外の場合はnull (選択肢: round, floor, ceil) 例: `round`
    - expressions (任意): array[object] - 金額計算式

### POST /api/1/expense_application_line_templates

操作: 経費科目の作成

説明: 概要 指定した事業所の経費科目を作成する 注意点 作成された経費科目のsource_line_template_idには、作成された経費科目自身のIDが設定されます。 required_receiptを未指定で作成した場合、添付ファイルは任意（false）になります。 item_idで品目を紐付けた場合でも、レスポンスに品目IDは含まれません。

### リクエストボディ

(必須)

- company_id (必須): integer(int64) - 事業所ID 例: `1` (最小: 1)
- name (必須): string - 経費科目名 (1000文字以内) 例: `交通費`
- account_item_id (必須): integer(int64) - 経費科目に紐付ける勘定科目のID。指定した事業所に存在する勘定科目のIDのみ指定可能です（存在しない場合は400エラー）。勘定科目IDは /account_items のAPIから取得可能です。 例: `1` (最小: 1)
- item_id (任意): integer(int64) - 経費科目に紐付ける品目のID。指定した事業所に存在する品目のIDのみ指定可能です（存在しない場合は400エラー）。勘定科目と品目の紐付けが設定されている事業所では、指定した勘定科目に紐付く品目のみ指定可能です。品目IDは /items のAPIから取得可能です。なお、レスポンスに品目IDは含まれません。 例: `1` (最小: 1)
- tax_code (必須): integer(int64) - 経費科目に紐付ける税区分コード（税区分のdisplay_categoryがtax_5: 5%表示の税区分, tax_r8: 軽減税率8%表示の税区分に該当するtax_codeのみ利用可能です。それ以外のtax_codeを指定した場合は400エラーになります。税区分のdisplay_categoryは /taxes/companies/{company_id}のAPIから取得可能です。） 例: `1` (最小: 0, 最大: 2147483647)
- description (任意): string - 経費科目の説明 (1000文字以内) 例: `電車、バス、飛行機などの交通費`
- line_description (任意): string - 内容の補足 (1000文字以内)。経費申請の作成時に内容欄へ何を入力すべきかを申請者に案内する文言 例: `移動区間`
- required_receipt (任意): boolean - 添付ファイルの必須/任意<br>
falseを指定した時は申請時の領収書の添付を任意とします。<br>
trueを指定した時は申請時の領収書の添付を必須とします。<br>
未指定の時は申請時の領収書の添付を任意とします。 例: `true`

### レスポンス (201)

- expense_application_line_template (必須): object
  - id (必須): integer(int64) - 経費科目ID 例: `1` (最小: 1)
  - source_line_template_id (必須): integer(int64) - 経費科目の元となるテンプレートを識別するID。経費科目の設定（名前や勘定科目など）を変更しても変わらない固定値 例: `1` (最小: 0)
  - name (必須): string - 経費科目名 例: `交通費`
  - account_item_id (必須): integer(int64) - 経費科目に紐づく勘定科目のID 例: `1` (最小: 1)
  - account_item_name (必須): string - 経費科目に紐づく勘定科目の名前 例: `旅費交通費`
  - tax_code (必須): integer(int64) - 経費科目に紐づく税区分コード 例: `1` (最小: 0, 最大: 2147483647)
  - tax_name (必須): string - 経費科目に紐づく税区分の名前 例: `課対仕入`
  - description (必須): string - 経費科目の説明。未設定の場合はnull 例: `電車、バス、飛行機などの交通費`
  - line_description (必須): string - 内容の補足。経費申請の作成時に内容欄へ何を入力すべきかを申請者に案内する文言。未設定の場合はnull 例: `移動区間`
  - required_receipt (必須): boolean - 添付ファイルの必須/任意（true: 経費申請の作成時に領収書などのファイル添付が必須, false: ファイル添付は任意） 例: `true`
  - custom_form_parts (任意): array[object] - カスタム申請項目
  - amount_setting (任意): string - 金額設定（none: なし, fix: 固定金額, expression: 計算式） (選択肢: none, fix, expression) 例: `expression`
  - rounding_setting (任意): string - 端数処理（round: 四捨五入, floor: 切り捨て, ceil: 切り上げ）。金額設定が計算式以外の場合はnull (選択肢: round, floor, ceil) 例: `round`
  - expressions (任意): array[object] - 金額計算式

### GET /api/1/expense_application_line_templates/{id}

操作: 経費科目の取得

説明: 概要 指定した事業所の経費科目を取得する 注意点 以下のいずれかに該当する経費科目はWeb版freee会計専用のため、本APIでは404エラーになります（経費科目一覧の取得APIでは取得できます）。 カスタム申請項目を含む 内容の入力設定が「必須」以外 金額の設定が「なし」以外

### パラメータ

| 名前 | 位置 | 必須 | 型 | 説明 |
|------|------|------|-----|------|
| id | path | はい | integer(int64) | 経費科目ID |
| company_id | query | はい | integer(int64) | 事業所ID |

### レスポンス (200)

- expense_application_line_template (必須): object
  - id (必須): integer(int64) - 経費科目ID 例: `1` (最小: 1)
  - source_line_template_id (必須): integer(int64) - 経費科目の元となるテンプレートを識別するID。経費科目の設定（名前や勘定科目など）を変更しても変わらない固定値 例: `1` (最小: 0)
  - name (必須): string - 経費科目名 例: `交通費`
  - account_item_id (必須): integer(int64) - 経費科目に紐づく勘定科目のID 例: `1` (最小: 1)
  - account_item_name (必須): string - 経費科目に紐づく勘定科目の名前 例: `旅費交通費`
  - tax_code (必須): integer(int64) - 経費科目に紐づく税区分コード 例: `1` (最小: 0, 最大: 2147483647)
  - tax_name (必須): string - 経費科目に紐づく税区分の名前 例: `課対仕入`
  - description (必須): string - 経費科目の説明。未設定の場合はnull 例: `電車、バス、飛行機などの交通費`
  - line_description (必須): string - 内容の補足。経費申請の作成時に内容欄へ何を入力すべきかを申請者に案内する文言。未設定の場合はnull 例: `移動区間`
  - required_receipt (必須): boolean - 添付ファイルの必須/任意（true: 経費申請の作成時に領収書などのファイル添付が必須, false: ファイル添付は任意） 例: `true`
  - custom_form_parts (任意): array[object] - カスタム申請項目
  - amount_setting (任意): string - 金額設定（none: なし, fix: 固定金額, expression: 計算式） (選択肢: none, fix, expression) 例: `expression`
  - rounding_setting (任意): string - 端数処理（round: 四捨五入, floor: 切り捨て, ceil: 切り上げ）。金額設定が計算式以外の場合はnull (選択肢: round, floor, ceil) 例: `round`
  - expressions (任意): array[object] - 金額計算式

### PUT /api/1/expense_application_line_templates/{id}

操作: 経費科目の更新

説明: 概要 指定した事業所の経費科目を更新する 注意点 本APIはリクエストボディで指定した内容への全置換で更新します。任意パラメータ（item_id, description, line_description, required_receipt）を未指定にした場合、その項目は未設定（required_receiptは任意 = false）にリセットされます。更新前の値を維持したい場合は、経費科目の取得APIで現在の値を確認し、すべてのパラメータを指定してください。 以下のいずれかに該当する経費科目はWeb版freee会計専用のため、本APIでは404エラーになります。 カスタム申請項目を含む 内容の入力設定が「必須」以外 金額の設定が「なし」以外

### パラメータ

| 名前 | 位置 | 必須 | 型 | 説明 |
|------|------|------|-----|------|
| id | path | はい | integer(int64) | 経費科目ID |

### リクエストボディ

(必須)

- company_id (必須): integer(int64) - 事業所ID 例: `1` (最小: 1)
- name (必須): string - 経費科目名 (1000文字以内) 例: `交通費`
- account_item_id (必須): integer(int64) - 経費科目に紐付ける勘定科目のID。指定した事業所に存在する勘定科目のIDのみ指定可能です（存在しない場合は400エラー）。勘定科目IDは /account_items のAPIから取得可能です。 例: `1` (最小: 1)
- item_id (任意): integer(int64) - 経費科目に紐付ける品目のID。指定した事業所に存在する品目のIDのみ指定可能です（存在しない場合は400エラー）。勘定科目と品目の紐付けが設定されている事業所では、指定した勘定科目に紐付く品目のみ指定可能です。品目IDは /items のAPIから取得可能です。なお、レスポンスに品目IDは含まれません。 例: `1` (最小: 1)
- tax_code (必須): integer(int64) - 経費科目に紐付ける税区分コード（税区分のdisplay_categoryがtax_5: 5%表示の税区分, tax_r8: 軽減税率8%表示の税区分に該当するtax_codeのみ利用可能です。それ以外のtax_codeを指定した場合は400エラーになります。税区分のdisplay_categoryは /taxes/companies/{company_id}のAPIから取得可能です。） 例: `1` (最小: 0, 最大: 2147483647)
- description (任意): string - 経費科目の説明 (1000文字以内) 例: `電車、バス、飛行機などの交通費`
- line_description (任意): string - 内容の補足 (1000文字以内)。経費申請の作成時に内容欄へ何を入力すべきかを申請者に案内する文言 例: `移動区間`
- required_receipt (任意): boolean - 添付ファイルの必須/任意<br>
falseを指定した時は申請時の領収書の添付を任意とします。<br>
trueを指定した時は申請時の領収書の添付を必須とします。<br>
未指定の時は申請時の領収書の添付を任意とします。 例: `true`

### レスポンス (200)

- expense_application_line_template (必須): object
  - id (必須): integer(int64) - 経費科目ID 例: `1` (最小: 1)
  - source_line_template_id (必須): integer(int64) - 経費科目の元となるテンプレートを識別するID。経費科目の設定（名前や勘定科目など）を変更しても変わらない固定値 例: `1` (最小: 0)
  - name (必須): string - 経費科目名 例: `交通費`
  - account_item_id (必須): integer(int64) - 経費科目に紐づく勘定科目のID 例: `1` (最小: 1)
  - account_item_name (必須): string - 経費科目に紐づく勘定科目の名前 例: `旅費交通費`
  - tax_code (必須): integer(int64) - 経費科目に紐づく税区分コード 例: `1` (最小: 0, 最大: 2147483647)
  - tax_name (必須): string - 経費科目に紐づく税区分の名前 例: `課対仕入`
  - description (必須): string - 経費科目の説明。未設定の場合はnull 例: `電車、バス、飛行機などの交通費`
  - line_description (必須): string - 内容の補足。経費申請の作成時に内容欄へ何を入力すべきかを申請者に案内する文言。未設定の場合はnull 例: `移動区間`
  - required_receipt (必須): boolean - 添付ファイルの必須/任意（true: 経費申請の作成時に領収書などのファイル添付が必須, false: ファイル添付は任意） 例: `true`
  - custom_form_parts (任意): array[object] - カスタム申請項目
  - amount_setting (任意): string - 金額設定（none: なし, fix: 固定金額, expression: 計算式） (選択肢: none, fix, expression) 例: `expression`
  - rounding_setting (任意): string - 端数処理（round: 四捨五入, floor: 切り捨て, ceil: 切り上げ）。金額設定が計算式以外の場合はnull (選択肢: round, floor, ceil) 例: `round`
  - expressions (任意): array[object] - 金額計算式

### DELETE /api/1/expense_application_line_templates/{id}

操作: 経費科目の削除

説明: 概要 指定した事業所の経費科目を削除する

### パラメータ

| 名前 | 位置 | 必須 | 型 | 説明 |
|------|------|------|-----|------|
| id | path | はい | integer(int64) | 経費科目ID |
| company_id | query | はい | integer(int64) | 事業所ID |

### レスポンス (204)



## 参考情報

- freee API公式ドキュメント: https://developer.freee.co.jp/docs
- OpenAPIスキーマ: [accounting-api-schema.json](../../openapi/accounting-api-schema.json)
