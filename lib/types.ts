export interface Protocol {
  id: string
  name: string
  icon?: string
  currentAPR: number
  tvl: number
  website: string
  packageId: string
  moduleName: string
  stakeFunctionName: string
  unstakeFunctionName: string
  minStake: number
  lockPeriod: number
  description: string
  features: string[]
}
