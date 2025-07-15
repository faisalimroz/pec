import { useEffect, useState } from 'react'
import { ChevronLeft, Menu, X } from 'lucide-react'
import { Layout, LayoutHeader } from './custom/layout'
import { Button } from './custom/button'
import Nav from './nav'
import { cn } from '@/lib/utils'
import { Link } from 'react-router-dom'
import logo from '@/assets/rhd.png'
import rhdLogo from '@/assets/rhd-logo.png'

interface SideLink {
  title: string
  href: string
}

interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  isCollapsed: boolean
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>
  sideLinks: SideLink[]
}

export default function Sidebar2({
  className,
  isCollapsed,
  setIsCollapsed,
  sideLinks,
}: SidebarProps) {
  const [navOpened, setNavOpened] = useState(false)

  /* Make body not scrollable when navBar is opened */
  useEffect(() => {
    if (navOpened) {
      document.body.classList.add('overflow-hidden')
    } else {
      document.body.classList.remove('overflow-hidden')
    }
  }, [navOpened])

  return (
    <aside
      className={cn(
        `fixed left-0 right-0 top-0 z-50 w-full border-r-2 border-r-muted transition-[width] md:bottom-0 md:right-auto md:h-svh ${isCollapsed ? 'md:w-16' : 'md:w-60'}`,
        className
      )}
    >
      {/* Overlay in mobile */}
      <div
        onClick={() => setNavOpened(false)}
        className={`absolute inset-0 transition-[opacity] delay-100 duration-700 ${navOpened ? 'h-svh opacity-50' : 'h-0 opacity-0'} w-full bg-black md:hidden`}
      />

      <Layout>
        {/* Header */}
        <LayoutHeader className='sticky top-0 justify-between bg-main px-4 py-3 shadow md:px-1'>
          <div className={`flex items-center ${!isCollapsed ? 'gap-2' : ''}`}>
            <Link to='/dashboard'>
              <img
                src={rhdLogo}
                alt='Logo'
                className={`transition-all ${isCollapsed ? 'h-12 w-12' : 'h-0 w-0'}`}
              />
              {/* <svg
                viewBox='0 0 60 10'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
                className={`transition-all ${isCollapsed ? 'h-12 w-12' : 'h-0 w-0'}`}
              >
                <path
                  d='M36.5229 11.4C35.1749 12.726 33.5819 13 31.6039 13H14.65C13.927 12.9293 13.2427 12.6404 12.6879 12.1715C12.1331 11.7026 11.7341 11.076 11.5439 10.375H7.13898C7.46387 12.1495 8.38626 13.7593 9.75287 14.9369C11.1195 16.1145 12.8479 16.7889 14.6509 16.848H31.605C33.0738 16.9456 34.5471 16.7433 35.9353 16.2535C37.3235 15.7637 38.5975 14.9967 39.6799 13.999L42.4559 11.267L39.556 8.41498C37.9 10.044 36.522 11.402 36.522 11.402'
                  fill='#ED1B2F'
                />
                <path
                  d='M14.65 3.89702H25.699C26.0053 3.94453 26.2822 4.10648 26.4737 4.35017C26.6652 4.59387 26.7572 4.90116 26.731 5.21001C26.757 5.51893 26.665 5.82622 26.4735 6.07003C26.282 6.31383 26.0053 6.47605 25.699 6.52402H11.542C11.3184 7.14082 11.2044 7.79194 11.205 8.44801C11.2044 9.1044 11.3185 9.75585 11.542 10.373H25.699C27.0868 10.3901 28.4248 9.85624 29.4196 8.88841C30.4144 7.92059 30.9849 6.59778 31.006 5.21001C30.9849 3.82233 30.4144 2.49964 29.4196 1.53197C28.4247 0.564307 27.0867 0.0306495 25.699 0.0480185H14.648C12.8447 0.107216 11.116 0.781899 9.74934 1.95988C8.3827 3.13787 7.46047 4.74817 7.13599 6.52302H11.541C11.731 5.82179 12.1299 5.19498 12.6847 4.72592C13.2395 4.25686 13.9239 3.96775 14.647 3.89702'
                  fill='#ED1B2F'
                />
                <path
                  d='M11.206 8.44695C11.2051 7.79095 11.3188 7.13983 11.542 6.52295H7.142C7.00472 7.15509 6.93533 7.80008 6.935 8.44695C6.93535 9.09415 7.00474 9.73947 7.142 10.3719H11.542C11.3188 9.75472 11.2051 9.10328 11.206 8.44695Z'
                  fill='#802629'
                />
                <path
                  d='M7.13797 6.52296H2.32697C1.78873 6.49624 1.26179 6.68357 0.861206 7.04406C0.460624 7.40454 0.218945 7.90889 0.188965 8.44696C0.218691 8.9852 0.46026 9.4898 0.86087 9.8505C1.26148 10.2112 1.78856 10.3987 2.32697 10.372H7.13797C7.00071 9.73948 6.93132 9.09416 6.93097 8.44696C6.93132 7.80009 7.00072 7.1551 7.13797 6.52296Z'
                  fill='#ED1B2F'
                />
                <path
                  d='M48.316 5.49498C49.663 4.16898 51.258 3.89499 53.236 3.89499H54.643C55.1814 3.92225 55.7088 3.73513 56.1097 3.37456C56.5105 3.01399 56.7522 2.50932 56.782 1.97098C56.752 1.43264 56.5102 0.928041 56.1095 0.567368C55.7087 0.206694 55.1815 0.0192521 54.643 0.0459748H53.236C51.7671 -0.0516429 50.2936 0.150693 48.9054 0.640656C47.5172 1.13062 46.2432 1.89796 45.161 2.89598L42.454 5.55998L45.354 8.41199L48.316 5.49498Z'
                  fill='#ED1B2F'
                />
                <path
                  d='M39.4 2.56597C38.1921 1.33399 36.6524 0.479365 34.968 0.105971C34.4415 -0.0324835 33.8825 0.0273116 33.3973 0.273993C32.912 0.520675 32.5343 0.937046 32.336 1.44397C32.2678 1.69767 32.2527 1.96273 32.2917 2.22253C32.3307 2.48232 32.423 2.73127 32.5627 2.95376C32.7023 3.17625 32.8865 3.3675 33.1035 3.51552C33.3206 3.66354 33.5658 3.76515 33.824 3.81397C34.7395 4.02995 35.5768 4.49673 36.242 5.16197L39.553 8.41397L42.453 5.56297L39.4 2.56597Z'
                  fill='#0071CE'
                />
                <path
                  d='M54.67 12.965H53.261C51.283 12.965 49.6909 12.694 48.3419 11.365L45.35 8.41101L42.45 11.263L45.183 13.963C46.2653 14.9605 47.5392 15.7274 48.9272 16.2172C50.3152 16.7069 51.7883 16.9093 53.257 16.812H54.666C55.2044 16.839 55.7316 16.6518 56.1324 16.2913C56.5332 15.9308 56.775 15.4263 56.805 14.888C56.775 14.3498 56.5332 13.8453 56.1324 13.4847C55.7316 13.1242 55.2044 12.937 54.666 12.964'
                  fill='#0071CE'
                />
                <path
                  d='M42.454 5.56201L39.554 8.41401L42.454 11.266L45.354 8.41401L42.454 5.56201Z'
                  fill='#0B1F8F'
                />
              </svg> */}
            </Link>

            <div
              className={`flex flex-col justify-end truncate ${isCollapsed ? 'invisible w-0' : 'visible w-auto'}`}
            >
              <Link to='/dashboard' className=''>
                <img src={logo} alt='Logo' className='w-auto h-12' />
                {/* <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='152.06'
                  height='16.846'
                  viewBox='0 0 152.06 16.846'
                >
                  <g
                    id='vSF5RA0qHP0RB93EoC4HUWsAyKk534C_fcK6S4oxXlvIkZ9AlgmRhxBMPqd-r8HIu79FXcNyKT9zVHcG_birsVj7HxuFht6ZaIddwzFF8s6I2Akt6GJNGRZRQZnp2UXxmWMKZUuHfmStFXfpjKD3pg'
                    transform='translate(0 149.717)'
                  >
                    <path
                      id='Path_21'
                      data-name='Path 21'
                      d='M-842.794-85.663c-1.348,1.326-2.941,1.6-4.919,1.6h-16.954a3.579,3.579,0,0,1-3.106-2.625h-4.405a7.9,7.9,0,0,0,7.512,6.473h16.954a10.853,10.853,0,0,0,8.075-2.849l2.776-2.732-2.9-2.852c-1.656,1.629-3.034,2.987-3.034,2.987'
                      transform='translate(879.129 -52.654)'
                      fill='#ed1b2f'
                    />
                    <path
                      id='Path_22'
                      data-name='Path 22'
                      d='M-215.449-110.393H-204.4a1.224,1.224,0,0,1,1.032,1.313,1.226,1.226,0,0,1-1.032,1.314h-14.157a5.631,5.631,0,0,0-.337,1.924,5.639,5.639,0,0,0,.337,1.925H-204.4a5.243,5.243,0,0,0,5.307-5.163,5.242,5.242,0,0,0-5.307-5.162h-11.051a7.9,7.9,0,0,0-7.512,6.475h4.405a3.579,3.579,0,0,1,3.106-2.626'
                      transform='translate(229.911 -35.427)'
                      fill='#ed1b2f'
                    />
                    <path
                      id='Path_23'
                      data-name='Path 23'
                      d='M-122.648-55.188a5.634,5.634,0,0,1,.336-1.924h-4.4a9.088,9.088,0,0,0-.207,1.924,9.1,9.1,0,0,0,.207,1.925h4.4a5.639,5.639,0,0,1-.336-1.925'
                      transform='translate(133.666 -86.082)'
                      fill='#802629'
                    />
                    <path
                      id='Path_24'
                      data-name='Path 24'
                      d='M-199.319,0h-4.811a2.04,2.04,0,0,0-2.138,1.924,2.04,2.04,0,0,0,2.138,1.925h4.811a9.1,9.1,0,0,1-.207-1.925A9.091,9.091,0,0,1-199.319,0'
                      transform='translate(206.269 -143.194)'
                      fill='#ed1b2f'
                    />
                    <path
                      id='Path_25'
                      data-name='Path 25'
                      d='M-168.148-156.233c1.347-1.326,2.942-1.6,4.92-1.6h1.407a2.039,2.039,0,0,0,2.139-1.924,2.041,2.041,0,0,0-2.139-1.925h-1.407a10.85,10.85,0,0,0-8.075,2.85l-2.707,2.664,2.9,2.852Z'
                      transform='translate(216.276 12.011)'
                      fill='#ed1b2f'
                    />
                    <path
                      id='Path_26'
                      data-name='Path 26'
                      d='M-204.842-72.056a8.906,8.906,0,0,0-4.432-2.46,2.22,2.22,0,0,0-2.632,1.338,1.908,1.908,0,0,0,1.488,2.37A5.063,5.063,0,0,1-208-69.46l3.311,3.252,2.9-2.851Z'
                      transform='translate(244.054 -75.095)'
                      fill='#0071ce'
                    />
                    <path
                      id='Path_27'
                      data-name='Path 27'
                      d='M-350.368-130.534h-1.409c-1.978,0-3.57-.271-4.919-1.6l-2.992-2.954-2.9,2.852,2.733,2.7a10.855,10.855,0,0,0,8.074,2.849h1.409a2.04,2.04,0,0,0,2.139-1.924,2.04,2.04,0,0,0-2.139-1.924'
                      transform='translate(404.85 -6.218)'
                      fill='#0071ce'
                    />
                    <path
                      id='Path_28'
                      data-name='Path 28'
                      d='M-83.113,0l-2.9,2.852,2.9,2.852,2.9-2.852Z'
                      transform='translate(125.379 -144.155)'
                      fill='#0b1f8f'
                    />
                    <path
                      id='Path_29'
                      data-name='Path 29'
                      d='M-62.955,0h-2.2V15.616h2.2V6.291h1.825V4.775h-1.825Z'
                      transform='translate(213.191 -149.172)'
                      fill='#0b1f8f'
                    />
                    <path
                      id='Path_30'
                      data-name='Path 30'
                      d='M-163.677-92.513v-3.226h-2.2v3.226a7.047,7.047,0,0,1-3.511,6.358l.965,1.243a9.052,9.052,0,0,0,3.645-3.549,9.046,9.046,0,0,0,3.641,3.549l.968-1.243a7.041,7.041,0,0,1-3.512-6.358'
                      transform='translate(307.092 -53.307)'
                      fill='#0b1f8f'
                    />
                    <path
                      id='Path_31'
                      data-name='Path 31'
                      d='M-62.955-117.43v-4.094h-2.2v11.372h2.2v-5.763h1.826v-1.515Z'
                      transform='translate(140.428 -27.649)'
                      fill='#0b1f8f'
                    />
                    <path
                      id='Path_32'
                      data-name='Path 32'
                      d='M-67.256-164.816a2.19,2.19,0,0,1,1.851-2.415,2.19,2.19,0,0,1,1.851,2.415A2.191,2.191,0,0,1-65.4-162.4a2.19,2.19,0,0,1-1.851-2.416m5.9,0a3.5,3.5,0,0,0-1.44-2.847h1.534v-1.516h-3.07v-1.383h-2.2v1.383H-69.6v1.516h1.589a3.5,3.5,0,0,0-1.439,2.847,3.968,3.968,0,0,0,4.046,3.885,3.968,3.968,0,0,0,4.046-3.885'
                      transform='translate(134.689 20.846)'
                      fill='#0b1f8f'
                    />
                    <path
                      id='Path_33'
                      data-name='Path 33'
                      d='M-298.97-140.732v-1.515H-307.2v-3.392h-2.2v3.613a1.311,1.311,0,0,0,1.38,1.294Z'
                      transform='translate(376.559 7.126)'
                      fill='#0b1f8f'
                    />
                    <path
                      id='Path_34'
                      data-name='Path 34'
                      d='M-23.149,0V6.873a1.313,1.313,0,0,0,1.381,1.3h2.821v4.569h-5.009v1.517h12.212V12.739h-5.008V8.17H-12.8V6.651h-8.155V1.518H-12.8V0Z'
                      transform='translate(119.789 -148.963)'
                      fill='#0b1f8f'
                    />
                    <path
                      id='Path_35'
                      data-name='Path 35'
                      d='M-213.257-273.408v-2.619h5.241v-1.516h-1.1v-4.1a1.314,1.314,0,0,0-1.381-1.3h-9.419v1.518h8.6v3.879h-9.375v1.516h5.241v2.619h-4.47v1.518h8.6v4.356h2.2v-5.874Z'
                      transform='translate(301.393 133.977)'
                      fill='#0b1f8f'
                    />
                    <path
                      id='Path_36'
                      data-name='Path 36'
                      d='M-23.183-223.709a1.312,1.312,0,0,0,1.38,1.3h2.936v3.643h-5.125v1.518h12.446v-1.518H-16.67v-3.643H-12.6v-1.517H-20.99V-226.1H-12.6v-4.115a1.313,1.313,0,0,0-1.381-1.3h-9.2v1.518H-14.8v2.378h-8.386Z'
                      transform='translate(133.946 82.546)'
                      fill='#0b1f8f'
                    />
                    <path
                      id='Path_37'
                      data-name='Path 37'
                      d='M-32.022,0V1.518h8.491V6.5h-3.064V3.549h-2.2V6.5h-4.348V8.016H-20V6.5h-1.336V1.3A1.313,1.313,0,0,0-22.716,0Z'
                      transform='translate(157.058 -148.963)'
                      fill='#0b1f8f'
                    />
                    <path
                      id='Path_38'
                      data-name='Path 38'
                      d='M-134.834-164.289a2.339,2.339,0,0,1-2.506-2.125,2.339,2.339,0,0,1,2.506-2.126,2.339,2.339,0,0,1,2.506,2.126,2.339,2.339,0,0,1-2.506,2.125m0-5.728c-2.6,0-4.7,1.613-4.7,3.6s2.106,3.6,4.7,3.6,4.7-1.614,4.7-3.6-2.1-3.6-4.7-3.6'
                      transform='translate(265.252 29.892)'
                      fill='#0b1f8f'
                    />
                  </g>
                </svg> */}
              </Link>
            </div>
          </div>

          {/* Toggle Button in mobile */}
          <Button
            variant='ghost'
            size='icon'
            className='md:hidden'
            aria-label='Toggle Navigation'
            aria-controls='sidebar-menu'
            aria-expanded={navOpened}
            onClick={() => setNavOpened((prev) => !prev)}
          >
            {navOpened ? <X /> : <Menu />}
          </Button>
        </LayoutHeader>

        {/* Navigation links */}
        <Nav
          id='sidebar-menu'
          className={`h-full font-roboto flex-1 overflow-auto ${navOpened ? 'max-h-screen' : 'max-h-0 py-0 md:max-h-screen md:py-2'}`}
          closeNav={() => setNavOpened(false)}
          isCollapsed={isCollapsed}
          // @ts-ignore
          links={sideLinks}
        />

        {/* Scrollbar width toggle button */}
        <Button
          onClick={() => setIsCollapsed((prev) => !prev)}
          size='icon'
          variant='outline'
          className='absolute -right-6 top-4 hidden rounded-full md:inline-flex'
        >
          <ChevronLeft
            className={`h-5 w-5 ${isCollapsed ? 'rotate-180' : ''}`}
          />
        </Button>
      </Layout>
    </aside>
  )
}
