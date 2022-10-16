import { NextPage } from "next"
import Link from "next/link"

import Meta from "@/view/common/Meta"
import DefaultLayout from "@/view/layout/default"

const _404: NextPage = () => {
  return (
    <>
      <Meta title="ページが見つかりませんでした" ogUrl="/404" disableIndex disableOgp />
      <DefaultLayout>
        <p>申し訳ありません。ページが見つかりませんでした。</p>
        <Link href="/">
          <a>トップに戻る</a>
        </Link>
      </DefaultLayout>
    </>
  )
}

export default _404
