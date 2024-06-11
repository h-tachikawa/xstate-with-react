import React, { useState } from 'react'
import { useMachine } from '@xstate/react'
import { createBrowserInspector } from '@statelyai/inspect'
import { approvalFlowMachine } from './approvalFlowMachine'
import './App.css'

const { inspect } = createBrowserInspector()

const App: React.FC = () => {
  const [current, send] = useMachine(approvalFlowMachine, { inspect })
  const [inputContent, setInputContent] = useState<string>('')

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (
    event,
  ) => {
    setInputContent(event.target.value)
  }

  const handleSubmit = (): void => {
    send({ type: 'submit', content: inputContent })
    setInputContent('')
  }

  const handleApprove = (): void => {
    send({
      type: 'approve',
    })
  }

  const handleReject = (): void => {
    send({
      type: 'reject',
    })
  }

  const handleResubmit = (): void => {
    send({
      type: 'resubmit',
      content: inputContent,
    })
    setInputContent('') // 入力をクリア
  }

  const handleCancel = (): void => {
    send({
      type: 'cancel',
    })
    setInputContent('') // 入力をクリア
  }

  return (
    <div className='container'>
      <h2>申請フロー管理</h2>
      <p>現在の状態: {current.value}</p>
      {current.matches('draft') && (
        <>
          <input
            type='text'
            value={inputContent}
            onChange={handleInputChange}
          />
          <button onClick={handleSubmit}>提出</button>
        </>
      )}
      {current.matches('pending') && (
        <>
          <p>申請内容: {current.context.applicationContent}</p>
          <button onClick={handleApprove}>承認</button>
          <button onClick={handleReject}>差し戻し</button>
        </>
      )}
      {current.matches('rejected') && (
        <>
          <input
            type='text'
            value={inputContent}
            onChange={handleInputChange}
          />
          <button onClick={handleResubmit}>再提出</button>
        </>
      )}
      <button onClick={handleCancel}>取消</button>
    </div>
  )
}

export default App
