import React, { useEffect , useState} from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner';
import PropTypes from 'prop-types'
import InfiniteScroll from 'react-infinite-scroll-component';

const News =(props)=> {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState([true])
  const [page, setpage] = useState(1)
  const [totalResults, setTotalResults] = useState(0)
 
 
  const Capitalize = (string)=> {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  


  const  updateNews =async()=>{
    
    
    const url= `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apikey}&page=${page}&pagesize=${props.pageSize}`;
    setLoading(true)
    let data = await fetch(url);
    props.setProgress(30);
    let parsedData = await data.json()
    props.setProgress(70);
    setArticles(parsedData.articles)
    setTotalResults(parsedData.totalResults)
    setLoading(false)
    
    props.setProgress(100);
  }
  useEffect(() => {
    document.title = `${Capitalize(props.category)} - NewsPulse`;
    updateNews();
  
  }, [])
  


  const fetchMoreData = async()=>{
    const url= `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apikey}&page=${page+1}&pagesize=${props.pageSize}`;
    setpage(page+1)
    let data = await fetch(url);
    let parsedData = await data.json()
    console.log(parsedData);
    setArticles(articles.concat(parsedData.articles))
    setTotalResults(parsedData.totalResults)
   
  }

  
    return (
      <>
        <h1 className="text-center" style={{margin: "35px 0px ",marginTop:"90px"}}>NewsPulse - Top {Capitalize(props.category)} Headlines</h1>
           {loading && <Spinner/>}       
           <InfiniteScroll  
          dataLength={articles.length} 
          next={fetchMoreData}
          hasMore={articles.length !== totalResults}
          loader={<Spinner/>}>
          
          <div className='container'>
          <div className="row">
          {articles.map((element)=>{
            return <div className="col-md-4" key={element.url}>        
                <NewsItem  title ={element.titlte?element.title.slice(0,45):""}
                 description={element.description?element.description.slice(0,88):""} 
                 imageUrl={element.urlToImage} newsUrl={element.url} 
                 author={element.author}  date={element.publishedAt}
                 source={element.source.name}/>
                </div>
          })}
          </div>
          </div>

        </InfiniteScroll> 

      </>
    )
  
}

News.defaultProps={
  country:'us',
  pageSize: 8,
  category:"general",
}
News.propTypes={
  country:PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string,
}
 
export default News