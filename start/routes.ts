/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import transmit from '@adonisjs/transmit/services/main'

const ChannelsController = () => import("#controllers/channels_controller");

transmit.registerRoutes();
router.get('/', [ChannelsController, 'index'])
router.get('/channel/:channel', [ChannelsController, 'channel'])
router.post('/channel/:channel/join', [ChannelsController, 'join'])
router.post('/channel/:channel/message', [ChannelsController, 'message'])