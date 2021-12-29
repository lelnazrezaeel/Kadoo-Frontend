import React, { useEffect, useState, useRef } from 'react'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Slide from '@mui/material/Slide'
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import Paper from '@mui/material/Paper'
import ProductIcon2 from '../../Components/productIcon/productIcon2'
import AppBar from '../../Components/AppBar/AppBar'
import Stack from '@mui/material/Stack'
import Alert from '@mui/material/Alert'
import ShowProduct from '../../Components/ShowProduct/ShowProduct'
import SkeletonArticle from '../../Components/Cart/SkeletonArticle'
import GreenHouseCard from '../../Components/ProductsCart/GreenHouseCard'
import ShowGreenHouse from '../../Components/ShowProduct/ShowGreenHouse'
import Fab from '@mui/material/Fab'
import { useTheme } from '@mui/material/styles'
import Zoom from '@mui/material/Zoom'
import AddIcon from '@mui/icons-material/Add'
import { Link } from 'react-router-dom'
import './Plantmanagement.css'
// Import Theme Files
import { ThemeProvider } from '@mui/material/styles'
import Theme from '../../Theme/ThemeGenerator'

function Plantmanagment(props) {
  const theme = useTheme()
  const fabStyle = {
    position: 'fixed',
    bottom: 16,
    right: 16,
  }

  const transitionDuration = {
    enter: theme.transitions.duration.enteringScreen,
    exit: theme.transitions.duration.leavingScreen,
  }

  const fabs = [
    {
      color: 'primary',
      sx: fabStyle,
      icon: <AddIcon />,
      label: 'Add',
    },
  ]
  ///const containerRef = React.useRef(null)
  const [openDrawer, setOpenDrawer] = React.useState([false])
  const [plantData, setPlantData] = React.useState([])
  const [plantId, setPlantId] = React.useState([])
  const [plantDataLoaded, setPlantDataLoaded] = React.useState(false)
  const [value, setValue] = React.useState(0)
  const [reload, setReload] = React.useState(false)

  const handleDrawerOpen = () => {
    setOpenDrawer(true)
  }

  const handleDrawerClose = () => {
    setOpenDrawer(false)
  }

  const handleReload = () => {
    setReload(reload ? false : true)
  }

  useEffect(() => {
    if (plantData.lenght === plantId.lenght) {
      setPlantDataLoaded(true)
    }
  }, [plantData])

  useEffect(() => {
    const requestOptions = {
      method: 'GET',
      headers: {
        Authorization: 'JWT ' + localStorage.getItem('access_token'),
        'Content-Type': 'application/json',
      },
    }

    setPlantDataLoaded(false)
    setTimeout(async () => {
      plantId.map((p) => {
        console.log('plant Id' + p.id)
        fetch(
          'http://127.0.0.1:8000/api/myPlantsRUD/' + p.id + '/',
          requestOptions
        ).then(async (response) => {
          let isJson = response.headers
            .get('content-type')
            ?.includes('application/json')
          let data = isJson ? await response.json() : null
          console.log('1')
          console.log(plantData)
          setPlantData((prestate) => [...prestate, data])
          console.log(data)
        })
      })
    }, 3000)
  }, [plantId])

  useEffect(() => {
    const requestOptions = {
      method: 'GET',
      headers: {
        Authorization: 'JWT ' + localStorage.getItem('access_token'),
        'Content-Type': 'application/json',
      },
    }
    setTimeout(async () => {
      fetch('http://127.0.0.1:8000/api/myPlants/', requestOptions)
        .then(async (response) => {
          const isJson = response.headers
            .get('content-type')
            ?.includes('application/json')
          const data = isJson ? await response.json() : null
          console.log(data)
          // check for error response
          console.log(response.status)
          if (!response.ok) {
            // get error message from body or default to response status
            const error = response.status
            return Promise.reject(error)
          }

          if (data === null) {
            setPlantDataLoaded(true)
            console.log('sadasd')
          } else {
            setPlantId(data)
          }
          console.log('1111')
          console.log(data.lenght)
        })
        .catch((error) => {
          if (error === 401) {
            alert('You should login first!')
          }
          console.error('There was an error!', error)
          setPlantDataLoaded(true)
        })
    }, 0)
  }, [reload])
  return (
    <div className='FontRight'>
      <ThemeProvider theme={Theme}>
        <AppBar
          SearchOption={true}
          TicketOption={true}
          CartOption={true}
          DrawerOption={false}
          AuthorizationOption={true}
          isopen={openDrawer}
          OpenMenu={handleDrawerOpen}
          CloseMenu={handleDrawerClose}
        />
        <Grid
          container
          item
          xs={24}
          alignItems='center'
          justify='center'
          direction='column'
          sx={{ p: 3.5, pt: 4 }}
        >
          <Grid item sx={{ width: '100%' }}>
            <Box sx={{ width: '100%' }}>
              {plantData.length != 0 && (
                <Grid
                  container
                  spacing={2}
                  xs={12}
                  sx={{ mt: 2 }}
                  sx={{ width: '100%' }}
                >
                  <Grid item sx={{ width: '100%' }}>
                    <ShowGreenHouse
                      data={plantData}
                      reloadFunc={handleReload}
                    />
                  </Grid>
                </Grid>
              )}
              {plantData.length === 0 && (
                <div>
                  {plantDataLoaded === true && (
                    <Grid container spacing={2} xs={12} sx={{ p: 3 }}>
                      <Alert severity='error' sx={{ width: '100%' }}>
                        There is NO plant right now! Come Back soon ...
                      </Alert>
                    </Grid>
                  )}
                  {plantDataLoaded === false && (
                    <Stack sx={{ m: 2 }}>
                      <SkeletonArticle />
                    </Stack>
                  )}
                </div>
              )}
            </Box>
          </Grid>
          {fabs.map((fab, index) => (
            <Zoom
              key={fab.color}
              in={value === index}
              timeout={transitionDuration}
              style={{
                transitionDelay: `${
                  value === index ? transitionDuration.exit : 0
                }ms`,
              }}
              unmountOnExit
            >
              <Link to='/greenHouseCreate/'>
                <Fab sx={fab.sx} aria-label={fab.label} color={fab.color}>
                  {fab.icon}
                </Fab>
              </Link>
            </Zoom>
          ))}
        </Grid>
      </ThemeProvider>
    </div>
  )
}

export default Plantmanagment
