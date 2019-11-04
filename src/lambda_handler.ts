import * as Slack from 'typed-slack'

export type Event = AWSLambda.SNSEvent

export default async (event: Event): Promise<string> => {
  await kindleSaleEvents(event.Records)
  return 'send message'
}

const kindleSaleEvents = async (
  records: AWSLambda.SNSEventRecord[]
): Promise<string> => {
  const url = process.env.URL
  const channel = process.env.CHANNEL

  const attachments = records.reduce((prev, current) => {
    const attachment: Slack.Attachment = {
      color: current.Sns.MessageAttributes.color.Value || '',
      title: current.Sns.MessageAttributes.title.Value || '',
      title_link: current.Sns.MessageAttributes.title_link.Value || '',
      text: current.Sns.MessageAttributes.text.Value || ''
    }
    prev.push(attachment)
    return prev
  }, new Array<Slack.Attachment>())

  const slack = new Slack.IncomingWebhook(url)
  const options: Slack.IncomingWebhookOptions = {
    text: 'セール情報',
    channel: channel,
    attachments
  }
  return slack.send(options)
}
