import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import allPortfolioData from '../data/portfolio.json'

const TypedPortfolioData: Record<string, string> = allPortfolioData
const usePortfolioQuery = () => {
  const [searchParams] = useSearchParams()

  const pidKey = Array.from(searchParams.keys())
    .find(param => param.toLowerCase() === 'pid')
  const pid = pidKey ? searchParams.get(pidKey) : null

  const portfolioData: string | undefined =
    useMemo(() => { if (pid) return TypedPortfolioData[pid.toLowerCase()] }, [searchParams])
  return { portfolioData, pid: portfolioData ? pid : undefined }
}

export default usePortfolioQuery