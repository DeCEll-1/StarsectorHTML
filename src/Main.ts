import { mount } from 'svelte'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import './main.css'
import './colors.css'
import Main from './Main.svelte'

const main = mount(Main, {
  target: document.getElementById('main')!,
})

export default main
