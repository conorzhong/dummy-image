'use client'

import { useRequest } from 'ahooks'
import { ColorPicker, Form, Input, Select, Typography } from 'antd'
import { Option } from '@/app/[size]/utils/option'

const defaultOption: Option = {
  width: 600,
  height: 400,
  bg: 'fff',
  color: '000',
  text: 'conor',
  format: 'png',
}

export const FormImage = () => {
  const [form] = Form.useForm()

  const { data, run } = useRequest(
    async () => {
      const option: Option = await form.validateFields()
      return `${window.location.href}${option.width}x${
        option.height
      }?${new URLSearchParams({
        bg: option.bg,
        color: option.color,
        text: option.text,
        format: option.format.toString(),
      })}`
    },
    {
      debounceWait: 500,
      debounceMaxWait: 2000,
    }
  )

  return (
    <div className='flex flex-col justify-center  items-center m-4'>
      {!!data && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={data}
            className='shadow m-4 max-w-full max-h-96 object-contain'
            alt='dummy-image'
          />
          <Typography.Paragraph copyable className='mb-4'>
            {data}
          </Typography.Paragraph>
        </>
      )}

      <Form<Option>
        form={form}
        initialValues={defaultOption}
        onValuesChange={() => {
          run()
        }}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
      >
        <Form.Item label='Width' name='width' rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label='Height' name='height' rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item
          label='Bg'
          name='bg'
          rules={[{ required: true }]}
          getValueFromEvent={(v) => v?.toHex()}
        >
          <ColorPicker />
        </Form.Item>
        <Form.Item
          label='Color'
          name='color'
          rules={[{ required: true }]}
          getValueFromEvent={(v) => v?.toHex()}
        >
          <ColorPicker />
        </Form.Item>
        <Form.Item label='Text' name='text' rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label='Format' name='format' rules={[{ required: true }]}>
          <Select
            options={[
              { label: 'jpeg', value: 'jpeg' },
              { label: 'png', value: 'png' },
              { label: 'webp', value: 'webp' },
              { label: 'gif', value: 'gif' },
              { label: 'tiff', value: 'tiff' },
              { label: 'avif', value: 'avif' },
              { label: 'heif', value: 'heif' },
            ]}
          />
        </Form.Item>
      </Form>
    </div>
  )
}
