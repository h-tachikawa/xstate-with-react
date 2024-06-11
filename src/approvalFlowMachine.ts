import { setup, assign } from 'xstate'

type ApprovalFlowContext = {
  applicationContent?: string // 申請内容
}

type SubmitEvent = { type: 'submit'; content: string } // 作成者が提出。申請内容を含む。
type ApprovalEvent = { type: 'approve' } // 承認者が承認
type RejectEvent = { type: 'reject' } // 承認者が差し戻し
type ResubmitEvent = { type: 'resubmit'; content: string } // 作成者が再提出
type CancelEvent = { type: 'cancel' } // 取消操作

type ApprovalFlowEvent =
  | SubmitEvent
  | ApprovalEvent
  | RejectEvent
  | ResubmitEvent
  | CancelEvent

const submitAction = assign<
  ApprovalFlowContext,
  SubmitEvent,
  any,
  ApprovalFlowEvent,
  any
>({
  applicationContent: ({ context, event }) => event.content,
})

const resubmitAction = assign<
  ApprovalFlowContext,
  ResubmitEvent,
  any,
  ApprovalFlowEvent,
  any
>({
  applicationContent: ({ context, event }) => event.content,
})

const approvalFlowMachine = setup({
  types: {
    context: {} as ApprovalFlowContext,
    events: {} as ApprovalFlowEvent,
  },
}).createMachine({
  id: 'documentMachine',
  initial: 'draft',
  context: {
    applicationContent: '',
  },
  states: {
    draft: {
      on: {
        submit: {
          target: 'pending',
          actions: [submitAction],
        },
        cancel: { target: 'canceled' },
      },
    },
    pending: {
      on: {
        approve: { target: 'approved' },
        reject: { target: 'rejected' },
        cancel: { target: 'canceled' },
      },
    },
    rejected: {
      on: {
        resubmit: { target: 'pending', actions: [resubmitAction] },
        cancel: { target: 'canceled' },
      },
    },
    approved: {
      on: {
        cancel: { target: 'canceled' },
      },
    },
    canceled: {
      type: 'final', // 最終状態
    },
  },
})

export { approvalFlowMachine }
