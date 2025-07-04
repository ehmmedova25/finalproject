import React from 'react'
import BestSellersHomepage from './bestSellershomepage/BestSellersHomepage'
import BannerSlider from './bannerslider/BannerSlider'
import CategoryPreview from '../../components/categories/CategoryPreview'
import RecipePreview from '../../components/recipepreview/RecipePreview'

const Home = () => {
  return (
<>

<BannerSlider/>

<BestSellersHomepage/>
<CategoryPreview/>
<RecipePreview/>
</> 
 )
}

export default Home
