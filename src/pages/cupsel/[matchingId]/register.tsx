import { Text, Textarea, TextInput, useMantineTheme } from "@mantine/core"
import { DatePicker } from "@mantine/dates"
import { AiOutlineEdit, AiOutlineLock, AiOutlineMessage } from "react-icons/ai"
import { NextPage } from "next"
import React from "react"

import WalkthroughLayout from "@/view/layout/walkthrough"
import CapsulePreview from "@/view/CapsulePreview"

const Register: NextPage = () => {
  const theme = useMantineTheme()
  return (
    <WalkthroughLayout
      title="カプセルを作ろう"
      totalStep={4}
      currentStep={3}
      onClickNext={null}
      onClickPrevOrClose={null}
    >
      <CapsulePreview capsuleColor={"#ffffff"} gpsColor={"#000000"} emoji={"😄"} lng={0} lat={0} />
      <Text className="pb-4" color="white" weight="bold" size="sm">
        カプセルの情報
      </Text>
      <TextInput
        className="pb-3"
        placeholder="タイトルを書く（最大18字）"
        icon={<AiOutlineEdit size={24} color={theme.colors.gray[0]} />}
        variant="filled"
        size="lg"
        iconWidth={48}
      />
      <DatePicker
        className="pb-3"
        placeholder="開封できる日を指定する"
        icon={<AiOutlineLock size={24} color={theme.colors.gray[0]} />}
        dropdownType="modal"
        variant="filled"
        size="lg"
        iconWidth={48}
        styles={(theme) => ({ input: { "&::placeholder": { color: theme.colors.gray[0] } } })}
      />
      <Textarea
        placeholder="メモを残す"
        icon={<AiOutlineMessage size={24} color={theme.colors.gray[0]} />}
        minRows={9}
        variant="filled"
        size="lg"
        iconWidth={48}
        styles={() => ({ icon: { top: 12, bottom: "initial" } })}
      />
    </WalkthroughLayout>
  )
}

export default Register
