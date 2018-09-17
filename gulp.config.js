
module.exports = {
  src:{
    root:'src/',
    scss:'src/assets/scss/',
    img:'src/assets/images/',
    js:'src/assets/js/',
    fonts:'src/assets/fonts/',
    data:'src/assets/data/'
  },
  dist:{
    root:'dist/',
    css:'dist/assets/css/',
    img:'dist/assets/images/',
    js:'dist/assets/js/',
    fonts:'dist/assets/fonts/',
    data:'dist/assets/data/'

  },
  node:{
    root:'node_modules/',
    css:[
    'node_modules/bootstrap/scss/',
    'node_modules/@fortawesome/fontawesome-free-webfonts/scss/',
    'node_modules/drop-shadow-converter/scss/',
    
     ],
    fonts:[
    'node_modules/@fortawesome/fontawesome-free-webfonts/webfonts/'
    ],
   
    js:[
    'node_modules/jquery/dist/jquery.js',
    './src/assets/js/main.js',
    './src/assets/js/form.js',
    'node_modules/bootstrap/dist/js/bootstrap.bundle.js',
    './src/assets/js/owl.carousel.min.js',
    'node_modules/wowjs/dist/wow.js',
    './src/assets/js/numscroller-1.0.js'
  ]
  }
  }
 