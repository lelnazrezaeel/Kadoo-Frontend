import * as React from 'react'
import Grid from '@mui/material/Grid'
import Navbar from '../../Components/Navbar/Navbar'
import Button from '@mui/material/Button'
import '../ProductPlantsPage/ProductPlantsPage.css'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import IconButton from '@mui/material/IconButton'
import Alert from '@mui/material/Alert'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import AppBar from '../../Components/AppBar/AppBar'
import Typography from '@mui/material/Typography'

class ProductToolsPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      product: [],
      tooltags: '',
      id: this.props.match.params.id,
      numberOfBuy: 0,
      totalPrice: 0,
      album: [],
      currentImage: 0,
      imageName: [],
    }
  }

  componentDidMount() {
    console.log('http://127.0.0.1:8000/api/toolsRUD/' + this.state.id)
    fetch('http://127.0.0.1:8000/api/toolsRUD/' + this.state.id + '/')
      .then((response) => response.json())
      .then((data) => this.setState({ product: data }))

    fetch('http://127.0.0.1:8000/api/toolTags/' + this.state.id + '/')
      .then((response) => response.json())
      .then((data) => {
        this.setState({ tooltags: data })
        console.log('tags')
        console.log(this.state.tooltags)
        console.log('http://127.0.0.1:8000/api/toolTags/' + this.state.id + '/')
      })
    fetch('http://127.0.0.1:8000/api/toolAlbumImages/' + this.state.id + '/')
      .then((response) => response.json())
      .then((data) => {
        this.setState({ album: data })
        this.setState({ imageName: data[0] })
        console.log(this.state.album)
        console.log(this.state.imageName.image)
      })
  }

  render() {
    var increaseBought = () => {
      var nob = this.state.numberOfBuy
      this.setState({
        numberOfBuy: nob + 1,
        totalPrice: (nob + 1) * this.state.product.price,
      })
    }
    var decreaseBought = () => {
      var nob = this.state.numberOfBuy
      if (nob > 0) {
        this.setState({
          numberOfBuy: nob - 1,
          totalPrice: (nob - 1) * this.state.product.price,
        })
      }
    }
    var backWardImageClick = () => {
      if (this.state.currentImage == 0) {
        this.setState({ currentImage: this.state.album.length - 1 })
      } else {
        this.setState({ currentImage: this.state.currentImage - 1 })
      }
      this.setState({ imageName: this.state.album[this.state.currentImage] })
    }
    var forWardImageClick = () => {
      if (this.state.currentImage == this.state.album.length - 1) {
        this.setState({ currentImage: 0 })
      } else {
        this.setState({ currentImage: this.state.currentImage + 1 })
      }
      this.setState({ imageName: this.state.album[this.state.currentImage] })
    }
    var addToBasket = () => {
      const requestOptions = {
        method: 'POST',
        headers: {
          Authorization: 'JWT ' + localStorage.getItem('access_token'),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: this.state.product.id,
          count: `${this.state.numberOfBuy}`,
        }),
      }
      console.log(requestOptions.body)
      fetch(
        'http://127.0.0.1:8000/api/cart/add-tool-to-cart/',
        requestOptions
      ).then((response) => {
        console.log(response.status)
        if (response.status === 201) {
          alert('successfully add!')
        } else if (response.status === 401) {
          console.log(response)
          alert('You are not login!')
        } else if (response.status === 400) {
          console.log(response)
          alert('This Plant is already in the Basket!')
        }
      })
    }

    return (
      <div>
        <Box>
          <AppBar
            SearchOption={true}
            TicketOption={true}
            CartOption={true}
            AuthorizationOption={true}
            DrawerOption={false}
          />
        </Box>

        <Grid
          container
          justifyContent='center'
          alignItems='center'
          sx={{ pl: { xs: 2, sm: 10 }, pr: { xs: 2, sm: 10 } }}
        >
          <Grid
            container
            item
            justifyContent='center'
            sx={{ mt: 10 }}
            className='ProductPageProductContainer'
          >
            <Grid
              item
              xs={12}
              md={6}
              lg={6}
              container
              justifyContent='center'
              alignItems='center'
              className='ProductPageImageContainer'
            >
              <Grid item container justifyContent='center' alignItems='center'>
                <Grid
                  container
                  item
                  justifyContent='center'
                  alignItems='center'
                >
                  <IconButton
                    sx={{ display: { xs: 'none', md: 'flex' } }}
                    size='large'
                    aria-label='show 4 new mails'
                    color='primary'
                    onClick={backWardImageClick}
                  >
                    <ArrowBackIosIcon />
                  </IconButton>
                  <img
                    className='ProductPageImage'
                    src={this.state.imageName.image}
                    alt={this.state.imageName.name}
                    sx={{
                      width: { xs: '300px', sm: '400px' },
                      height: { xs: '300px', sm: '400px' },
                    }}
                  ></img>
                  <IconButton
                    sx={{ display: { xs: 'flex', md: 'none' } }}
                    size='large'
                    aria-label='show 4 new mails'
                    color='primary'
                    onClick={backWardImageClick}
                  >
                    <ArrowBackIosIcon />
                  </IconButton>
                  <IconButton
                    size='large'
                    aria-label='show 4 new mails'
                    color='primary'
                    onClick={forWardImageClick}
                  >
                    <ArrowForwardIosIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} md={6} lg={6} sx={{ p: 2 }}>
              <Grid container spacing={1}>
                <Grid item xs={12} md={12} lg={12} className='ProductPageTitle'>
                  <div className='productPageTitle'>
                    {this.state.product.name}
                  </div>
                  <hr />
                </Grid>
                <Grid
                  item
                  xs={12}
                  md={12}
                  lg={12}
                  spacing={1}
                  className='ProductPageText'
                >
                  <div className='ProductPageText'>
                    {' '}
                    <b>Description:</b> {this.state.product.description}{' '}
                  </div>
                  <Box sx={{ mt: 0.5, mb: 1.5 }}>
                    {this.state.tooltags.length !== 0 && (
                      <Box>
                        <b>Tags: </b>
                        {this.state.tooltags.map((item) => (
                          <Chip
                            sx={{ mr: 0.5 }}
                            label={item.name}
                            variant='outlined'
                          />
                        ))}
                      </Box>
                    )}
                  </Box>
                  <hr />
                </Grid>
                <Grid
                  item
                  container
                  xs={12}
                  md={12}
                  lg={12}
                  className='ProductPageBuyContainer'
                >
                  <Grid container item spacing={0} alignItems='center'>
                    <Grid item container className='ProductPageTitle'>
                      <div className='productPagePrice'>
                        {' '}
                        <b>Price:</b> {this.state.product.price} $
                      </div>
                    </Grid>
                    <Grid
                      container
                      item
                      sx={{ justifyContent: { xs: 'center', sm: 'left' } }}
                      className='ProductPageCounter'
                    >
                      <Grid item xs={6} className='ProductPageTitle'>
                        Total Price : {this.state.totalPrice}$
                      </Grid>
                      <Grid item xs={6}>
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                          }}
                        >
                          <IconButton
                            size='large'
                            aria-label='show 4 new mails'
                            color='inherit'
                            sx={{ color: 'error.main' }}
                            onClick={decreaseBought}
                          >
                            <RemoveIcon />
                          </IconButton>
                          <Typography className='ProductPageCounterNum'>
                            {this.state.numberOfBuy}
                          </Typography>
                          <IconButton
                            size='large'
                            aria-label='show 4 new mails'
                            color='inherit'
                            sx={{ color: 'success.main' }}
                            onClick={increaseBought}
                          >
                            <AddIcon />
                          </IconButton>
                        </Box>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid
                    container
                    item
                    justifyContent='flex-end'
                    sx={{ p: 3, Color: '#12824C' }}
                    className='ProductPageTitle'
                  >
                    <Button
                      variant='contained'
                      className='productsPageAdd'
                      onClick={addToBasket}
                    >
                      Add To Bascket
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    )
  }
}

export default ProductToolsPage
