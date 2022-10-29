import { NextPage } from "next"
import Link from "next/link"

import MetaHeader from "../view/common/MetaHeader"
import DefaultLayout from "../view/layout/default"

const _500: NextPage = () => {
  return (
    <>
      <MetaHeader title="エラーが発生しました" disableIndex disableOgp />
      <DefaultLayout>
        <p>申し訳ありません。エラーが発生しました。</p>
        <Link href="/">
          <a>トップに戻る</a>
        </Link>
      </DefaultLayout>
    </>
  )
}

export default _500
