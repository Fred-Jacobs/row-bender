/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import mustache from 'mustache'
import { parseCsv, catchMessage } from 'components/helpers'

type CallbackFunction = (msg: string) => void;

export class RenderingService {
  public onError: CallbackFunction
  public onSuccess: CallbackFunction
  private template = ''
  private csvRaw = ''
  private jsonRaw = ''
  private csvHasHeader = true
  private rows: any = {}
  private json: any = {}
  constructor() {
    this.onError = (m) => { throw m }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    this.onSuccess = (m) => { }
  }

  public render() : string {
    try {
      const result = mustache.render(this.template, this.json)
      return result
    } catch (e) {
      return catchMessage(e)
    }
  }

  public setTemplate(template: string) : RenderingService {
    if (typeof template !== 'string')
      return this

    try {
      this.template = template
    } catch (e) {
      this.onError(catchMessage(e))
    }
    return this
  }

  public setJson(json: string) : RenderingService {
    if (typeof json !== 'string')
      return this

    try {
      this.jsonRaw = json
      this.json = JSON.parse(this.jsonRaw)
      this.json.rows = this.rows
    } catch (e) {
      this.onError(catchMessage(e))
    }
    return this
  }

  public setCsv(hasHeaders: boolean, csv?: string) : RenderingService {
    if (typeof csv !== 'string' && csv !== undefined)
      return this

    try {
      if (csv !== undefined) {
        this.csvRaw = csv
      }
      this.csvHasHeader = hasHeaders
      this.rows = parseCsv(this.csvRaw, this.csvHasHeader)
      this.json.rows = this.rows
    } catch (e) {
      this.onError(catchMessage(e))
    }
    return this
  }
}
