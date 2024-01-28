import { webpackConfig } from '@tyle/webpack-config'

export default webpackConfig({
  head: [
    '<script>window.FontAwesomeConfig = { autoReplaceSvg: false }</script>',
    '<script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/js/all.js" integrity="sha512-HAXr8ULpyrhyIF0miP+mFTwOagNI+UVA38US1XdtBbkU7mse59ar0ck4KBil/jyzkTO37DWLfRQvEeUWgwHu0g==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>',
    '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.css" integrity="sha512-tx5+1LWHez1QiaXlAyDwzdBTfDjX07GMapQoFTS74wkcPMsI3So0KYmFe6EHZjI8+eSG0ljBlAQc3PQ5BTaZtQ==" crossorigin="anonymous" referrerpolicy="no-referrer" />',
  ].join('\n'),
})
