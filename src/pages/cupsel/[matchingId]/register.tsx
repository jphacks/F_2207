import { Text, Textarea, TextInput } from "@mantine/core"
import { DatePicker } from "@mantine/dates"
import { AiOutlineEdit, AiOutlineLock, AiOutlineMessage } from "react-icons/ai"
import { NextPage } from "next"
import React from "react"

import WalkthroughLayout from "@/view/layout/walkthrough"
import CapsulePreview from "@/view/CapsulePreview"

const Register: NextPage = () => {
  return (
    <WalkthroughLayout
      title="カプセルを作ろう"
      totalStep={4}
      currentStep={3}
      onClickNext={null}
      onClickPrevOrClose={null}
    >
      <CapsulePreview capsuleColor={"#ffffff"} gpsColor={"#000000"} emoji={"😄"} lng={0} lat={0} />
      <Text color="white" weight="bold" size="sm">
        カプセルの情報
      </Text>
      <TextInput placeholder="タイトルを書く（最大18字）" icon={<AiOutlineEdit />} />
      <DatePicker placeholder="開封できる日を指定する" icon={<AiOutlineLock />} />
      <Textarea placeholder="メモを残す" icon={<AiOutlineMessage />} />
    </WalkthroughLayout>
  )
}

export default Register
