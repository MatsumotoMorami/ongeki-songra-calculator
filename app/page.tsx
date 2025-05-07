'use client'

import { useState, useEffect } from 'react'
import { Input } from './components/ui/input'
import { RadioGroup, RadioGroupItem } from './components/ui/radio-group'

export default function Home() {
  const [rating, setRating] = useState('')
  const [score, setScore] = useState('')
  const [platinumScore, setPlatinumScore] = useState('')
  const [totalPlatinumScore, setTotalPlatinumScore] = useState('')
  const [fbStatus, setFbStatus] = useState('')
  const [fcStatus, setFcStatus] = useState('')
  const [starRating, setStarRating] = useState('')
  const [calculatedPlatinumScore, setCalculatedPlatinumScore] = useState('0.000')
  const [oldRating, setOldRating] = useState('0.000')
  const [newRating, setNewRating] = useState('0.000')

  // 计算星级的函数
  const calculateStarRating = (score: string, total: string) => {
    if (!score || !total || total === '0') return '0'
    
    const percentage = (parseFloat(score) / parseFloat(total)) * 100
    
    if (percentage < 94) return '0'
    if (percentage < 95) return '1'
    if (percentage < 96) return '2'
    if (percentage < 97) return '3'
    if (percentage < 98) return '4'
    return '5'
  }

  // 计算白金分数的函数
  const calculatePlatinumScore = (rating: string, stars: string) => {
    if (!rating || !stars) return '0.000'
    
    const ratingNum = parseFloat(rating)
    const starsNum = parseInt(stars)
    
    if (isNaN(ratingNum) || isNaN(starsNum)) return '0.000'
    
    const result = (starsNum * ratingNum * ratingNum) / 1000
    return result.toFixed(3)
  }

  // 计算旧分数评级的函数
  const calculateOldRating = (rating: string, score: string) => {
    if (!rating || !score) return '0.000'
    
    const ratingNum = parseFloat(rating)
    const scoreNum = parseFloat(score)
    
    if (isNaN(ratingNum) || isNaN(scoreNum)) return '0.000'
    
    // 定义分数区间和对应的评级
    const ranges = [
      { min: 1007500, max: Infinity, rating: ratingNum + 2.00 },
      { min: 1000000, max: 1007500, rating: ratingNum + 1.50 },
      { min: 990000, max: 1000000, rating: ratingNum + 1.00 },
      { min: 970000, max: 990000, rating: ratingNum },
      { min: 900000, max: 970000, rating: ratingNum - 4.00 },
      { min: 800000, max: 900000, rating: ratingNum - 6.00 },
      { min: 500000, max: 800000, rating: 0 },
      { min: 0, max: 500000, rating: 0 }
    ]
    
    // 找到分数所在的区间
    const range = ranges.find(r => scoreNum >= r.min && scoreNum < r.max)
    if (!range) return '0.000'
    
    // 如果是最后一个区间（0-500000），直接返回0
    if (range.min === 0) return '0.000'
    
    // 如果是第一个区间（1007500以上），直接返回对应评级
    if (range.min === 1007500) return range.rating.toFixed(3)
    
    // 计算线性插值
    const rangeSize = range.max - range.min
    const scorePosition = scoreNum - range.min
    const ratio = scorePosition / rangeSize
    
    // 获取下一个区间的评级
    const nextRange = ranges[ranges.indexOf(range) - 1]
    const ratingDiff = nextRange.rating - range.rating
    
    // 计算最终评级
    const result = range.rating + (ratingDiff * ratio)
    return result.toFixed(3)
  }

  // 计算新分数评级的函数
  const calculateNewRating = (rating: string, score: string, fb: string, fc: string) => {
    if (!rating || !score) return '0.000'
    
    const ratingNum = parseFloat(rating)
    const scoreNum = parseFloat(score)
    
    if (isNaN(ratingNum) || isNaN(scoreNum)) return '0.000'
    
    // 定义分数区间和对应的评级
    const ranges = [
      { min: 1010000, max: Infinity, rating: ratingNum + 2.00 },
      { min: 1007500, max: 1010000, rating: ratingNum + 1.75 },
      { min: 1000000, max: 1007500, rating: ratingNum + 1.25 },
      { min: 990000, max: 1000000, rating: ratingNum + 0.75 },
      { min: 970000, max: 990000, rating: ratingNum },
      { min: 900000, max: 970000, rating: ratingNum - 4.00 },
      { min: 800000, max: 900000, rating: ratingNum - 6.00 },
      { min: 500000, max: 800000, rating: 0 },
      { min: 0, max: 500000, rating: 0 }
    ]
    
    // 找到分数所在的区间
    const range = ranges.find(r => scoreNum >= r.min && scoreNum < r.max)
    if (!range) return '0.000'
    
    // 如果是最后一个区间（0-500000），直接返回0
    if (range.min === 0) return '0.000'
    
    // 如果是第一个区间（1010000以上），直接返回对应评级
    if (range.min === 1010000) {
      let result = range.rating
      // 添加额外加成
      if (fb === 'fb') result += 0.05
      if (fc === 'fc') result += 0.1
      if (fc === 'ab') result += 0.3
      if (fc === 'ab-plus') result += 0.35
      if (scoreNum >= 1007500) result += 0.3
      else if (scoreNum >= 1000000) result += 0.2
      else if (scoreNum >= 990000) result += 0.1
      return result.toFixed(3)
    }
    
    // 计算线性插值
    const rangeSize = range.max - range.min
    const scorePosition = scoreNum - range.min
    const ratio = scorePosition / rangeSize
    
    // 获取下一个区间的评级
    const nextRange = ranges[ranges.indexOf(range) - 1]
    const ratingDiff = nextRange.rating - range.rating
    
    // 计算基础评级
    let result = range.rating + (ratingDiff * ratio)
    
    // 添加额外加成
    if (fb === 'fb') result += 0.05
    if (fc === 'fc') result += 0.1
    if (fc === 'ab') result += 0.3
    if (fc === 'ab-plus') result += 0.35
    if (scoreNum >= 1007500) result += 0.3
    else if (scoreNum >= 1000000) result += 0.2
    else if (scoreNum >= 990000) result += 0.1
    return result.toFixed(3)
  }

  // 当白金分数或总分数变化时，自动计算星级
  useEffect(() => {
    const newStarRating = calculateStarRating(platinumScore, totalPlatinumScore)
    setStarRating(newStarRating)
  }, [platinumScore, totalPlatinumScore])

  // 当星级或定数变化时，自动计算白金分数
  useEffect(() => {
    const newPlatinumScore = calculatePlatinumScore(rating, starRating)
    setCalculatedPlatinumScore(newPlatinumScore)
  }, [rating, starRating])

  // 当分数或定数变化时，自动计算旧分数评级
  useEffect(() => {
    const newOldRating = calculateOldRating(rating, score)
    setOldRating(newOldRating)
  }, [rating, score])

  // 当分数、定数、FB状态或FC状态变化时，自动计算新分数评级
  useEffect(() => {
    const newRating = calculateNewRating(rating, score, fbStatus, fcStatus)
    setNewRating(newRating)
  }, [rating, score, fbStatus, fcStatus])

  return (
    <main className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-2xl space-y-8">
        <h1 className="text-3xl font-bold text-foreground">单曲Rating查分器</h1>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">曲目定数</label>
            <Input
              type="number"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              placeholder="请输入曲目定数"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">分数</label>
            <Input
              type="number"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              placeholder="请输入分数"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">白金分数</label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm text-muted-foreground">获得分数</label>
                <Input
                  type="number"
                  value={platinumScore}
                  onChange={(e) => setPlatinumScore(e.target.value)}
                  placeholder="获得的白金分数"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm text-muted-foreground">总分数</label>
                <Input
                  type="number"
                  value={totalPlatinumScore}
                  onChange={(e) => setTotalPlatinumScore(e.target.value)}
                  placeholder="总白金分数"
                />
              </div>
            </div>
            <div className="space-y-2 pt-2">
              <label className="text-sm font-medium text-foreground">星星评级</label>
              <RadioGroup
                value={starRating}
                onValueChange={setStarRating}
                className="grid grid-cols-3 gap-4"
              >
                <div className="flex items-center space-x-2" onClick={()=>{setPlatinumScore('0')}} >
                  <RadioGroupItem value="0" id="star0" />
                  <label htmlFor="star0">无</label>
                </div>
                <div className="flex items-center space-x-2" onClick={()=>{setPlatinumScore(String(Math.ceil(parseInt(totalPlatinumScore)*0.94)))}} >
                  <RadioGroupItem value="1" id="star1" disabled={totalPlatinumScore==''}/>
                  <label htmlFor="star1">⭐</label>
                </div>
                <div className="flex items-center space-x-2" onClick={()=>{setPlatinumScore(String(Math.ceil(parseInt(totalPlatinumScore)*0.95)))}} >
                  <RadioGroupItem value="2" id="star2" disabled={totalPlatinumScore==''}/>
                  <label htmlFor="star2">⭐⭐</label>
                </div>
                <div className="flex items-center space-x-2" onClick={()=>{setPlatinumScore(String(Math.ceil(parseInt(totalPlatinumScore)*0.96)))}} >
                  <RadioGroupItem value="3" id="star3" disabled={totalPlatinumScore==''}/>
                  <label htmlFor="star3">⭐⭐⭐</label>
                </div>
                <div className="flex items-center space-x-2" onClick={()=>{setPlatinumScore(String(Math.ceil(parseInt(totalPlatinumScore)*0.97)))}} >
                  <RadioGroupItem value="4" id="star4" disabled={totalPlatinumScore==''}/>
                  <label htmlFor="star4">⭐⭐⭐⭐</label>
                </div>
                <div className="flex items-center space-x-2" onClick={()=>{setPlatinumScore(String(Math.ceil(parseInt(totalPlatinumScore)*0.98)))}} >
                  <RadioGroupItem value="5" id="star5" disabled={totalPlatinumScore==''}/>
                  <label htmlFor="star5">⭐⭐⭐⭐⭐</label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">FB状态</label>
            <RadioGroup
              value={fbStatus}
              onValueChange={setFbStatus}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="fb" id="fb" />
                <label htmlFor="fb">FB</label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="not-fb" id="not-fb" />
                <label htmlFor="not-fb">未FB</label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">FC状态</label>
            <RadioGroup
              value={fcStatus}
              onValueChange={setFcStatus}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="not-fc" id="not-fc" />
                <label htmlFor="not-fc">未FC</label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="fc" id="fc" />
                <label htmlFor="fc">FC</label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="ab" id="ab" />
                <label htmlFor="ab">AB</label>
              </div>
              <div className="flex items-center space-x-2" onClick={()=>setScore("1010000")}>
                <RadioGroupItem value="ab-plus" id="ab-plus" />
                <label htmlFor="ab-plus">AB+</label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-4">
            <div className="rounded-lg border p-4">
              <h2 className="text-lg font-semibold text-foreground">旧分数评级</h2>
              <p className="text-foreground">{oldRating}</p>
            </div>
            <div className="rounded-lg border p-4">
              <h2 className="text-lg font-semibold text-foreground">新分数评级</h2>
              <p className="text-foreground">{newRating}</p>
            </div>
            <div className="rounded-lg border p-4">
              <h2 className="text-lg font-semibold text-foreground">白金分数评级</h2>
              <p className="text-foreground">{calculatedPlatinumScore}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
