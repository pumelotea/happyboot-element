const Handlebars = require('handlebars')

Handlebars.registerHelper('ifInput', function(context, options) {
  if (context === 'input') {
    return options.fn(this)
  }
  return options.inverse(this)
})

Handlebars.registerHelper('ifSelect', function(context, options) {
  if (context === 'select') {
    return options.fn(this)
  }
  return options.inverse(this)
})

Handlebars.registerHelper('ifSelection', function(context, options) {
  if (context === 'selection') {
    return options.fn(this)
  }
  return options.inverse(this)
})

Handlebars.registerHelper('ifData', function(context, options) {
  if (context === 'data') {
    return options.fn(this)
  }
  return options.inverse(this)
})

Handlebars.registerHelper('ifActions', function(context, options) {
  if (context === 'actions') {
    return options.fn(this)
  }
  return options.inverse(this)
})

Handlebars.registerHelper('ifTrue', function(context, options) {
  if (context === true) {
    return options.fn(this)
  }
  return options.inverse(this)
})

Handlebars.registerHelper('ifFalse', function(context, options) {
  if (context === false) {
    return options.fn(this)
  }
  return options.inverse(this)
})

const fs = require('fs')


function cook(food, menuJsonFile) {
  const data = JSON.parse(fs.readFileSync(__dirname + '/' + menuJsonFile).toString())
  switch (food) {
    case 'page': {
      const page = fs.readFileSync(__dirname + '/' + './page.vue.template').toString()
      const template = Handlebars.compile(page)
      fs.writeFileSync(__dirname+'/out/index.vue', template(data))
      break
    }
    case 'drawer': {
      break
    }
  }
}

function menu(food) {
  switch (food) {
    case 'page':
      fs.writeFileSync(__dirname+'/out/page.json', fs.readFileSync(__dirname+'/page.json.template'))
      break
    case 'drawer':
  }
}

// 创建配置文件
// yarn cook page config
// 生成代码
// yarn cook page

function main() {
  const food = process.argv[2]
  const act = process.argv[3]
  const menuJsonFile = process.argv[4] || 'out/page.json'

  switch (act) {
    default:
      cook(food, menuJsonFile)
      break
    case 'config':
      menu(food)
      break
  }
}

main()
