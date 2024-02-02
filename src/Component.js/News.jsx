import React, { useState, useEffect } from 'react'
import NewsItem from './NewsItem'
import PropTypes from 'prop-types'
import InfiniteScroll from 'react-infinite-scroll-component'



const News = (props) => {
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  document.title = `${capitalizeFirstLetter(props.category)}-NewsFizz`

  const updateNews = async () => {
    props.setProgress(30);
    let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=c1448f55ceb3475f9ce26584a590b819&page=${page}&pagesize=${props.pagesize}`
    let data = await fetch(url)
    props.setProgress(50);
    let parseddata = await data.json();
    props.setProgress(70);
    setArticles(parseddata.articles);
    setTotalResults(parseddata.totalResults)
    props.setProgress(100);
  }

  useEffect(() => {
    updateNews();
  }, [])

  const backToTop = () => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }

  const fetchData = async () => {
    setPage(page + 1);
    let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=c1448f55ceb3475f9ce26584a590b819&page=${page + 1}&pagesize=${props.pagesize}`
    let data = await fetch(url)
    let parseddata = await data.json();
    setArticles(articles.concat(parseddata.articles))
    setTotalResults(parseddata.totalResults)
  }

  return (
    <div className="container" style={{ marginTop: "90px" }}>
      <h2 className="text-center">Top {capitalizeFirstLetter(props.category)} HeadLines</h2>
      <InfiniteScroll
        dataLength={articles.length}
        next={fetchData}
        hasMore={articles.length !== totalResults}>

        <div className="row my-4 mx-4" >
          {articles.map((element) => {
            return <div className='col-md-4' key={element.url}>
              <NewsItem title={element.title} description={element.description} imageUrl={element.urlToImage} newsUrl={element.url} source={element.source.name} author={element.author} publishedAt={element.publishedAt} />
            </div>
          })}
        </div>
        
        <div className="centre" >
          <button type="button" className="btn btn-success " style={{ display: 'flex' }} onClick={backToTop}>Back To Top</button>
        </div>
      </InfiniteScroll>

    </div>
  )
}

News.defaultProps = {
  country: "in",
  pagesize: 9,
  category: "general",
}

News.propTypes = {
  country: PropTypes.string,
  pagesize: PropTypes.number,
  category: PropTypes.string,
}

export default News
