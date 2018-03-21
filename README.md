This contains code for my bachelor thesis project (BTP). This is a drawing tool for data visualization. My focus is on making an Illustrator like drawing interface for charts with the attributes (styles, width, radius, etc) of the graphic elements (circle, rectangle, etc.) being driven by data or relationships to other elements.

# Inspirations
These are some of the tools that served as inspiration for my project. I have shamelessly not only taken ideas from them, but also implementation logic.

  - [Apparatus](http://aprt.us/)
  - [Bret Victor's talk on "Drawing Dynamic Visualization"](http://worrydream.com/DrawingDynamicVisualizationsTalkAddendum/)
  - [Recursive drawing](http://recursivedrawing.com/)
  - Adobe Illustrator

# Core principles
A lot of my principles are derived from the implementation of SVG as that is what this tool renders the charts in.
- Every visualization/chart can be broken down into fundamental shapes.
- A shape has dimensions and styles: both collectively called attributes.
- The attributes can be driven by data or be driven by relationships to other shapes.
- A visualization/chart is just this fundamental shapes looped over the entire dataset (if a dataset is used).

For example: A bar chart's fundamental shape is a rectangle. With the height and x-position being mapped to some data columns say, index and apples. So the height and x-position are it's dimensions that are driven by data. Once we defined this fundamental shape, we can loop over the entire data set to get a bar chart.

# How to use this tool
This is still under very active development as I finish my degree. So a ton of things can change pretty quickly. But hopefully the basic driving principles would remain the same.

I am still figuring out build configs for this to be able to be fast and small. Also have to work on many many logic fixes for it to work fast as well. SoJust fyi.

Setting this up for using is pretty simple:
```
npm install
npm start
```

# Libraries used
- [React](https://github.com/facebook/react/) for rendering the SVG elements.
- [D3](https://github.com/d3/d3) for various chart elements like axis, colour schemes etc.
- [Redux](https://github.com/reactjs/react-redux/) for managing my state/logic.
- [Codemirror](https://github.com/codemirror/codemirror) and the beautiful [React-Codemirror2](https://github.com/scniro/react-codemirror2) for editing attributes and essentially making it alive.

` Warning `

I'm a huge noob at this and am learning. I'm not well versed in code design patterns, etc. so the code here might not be pretty/efficient and may make you cringe. I tried my best to remove bottlenecks and inefficiencies but a lot remains to be done. I'm using React for the first time and this is my first "app". So just so you know what lies ahead, be prepared to maybe find it ugly. In case you have any feedback and suggestions for improvements in the code, I would love to hear them at sharma.manas271196@gmail.com.

The motive of this project for me was to learn and implement some of the ideas I've had of easing the process of telling stories with charts for the non-coding crowd, especially journalists. This might not be the perfect tool, but it may serve as a stepping stone for one.

And of course this tool itself is open source so do whatever you want with it. In case my code is too shit to understand, mail me at sharma.manas271196@gmail.com and I'll try to figure it out with you.

#### TODO
- [ ]  codemirror doesn't render same mark consecutively on delete, drag drop.
- [ ]  Add DragLayer component for showing component while dragging.
- [ ]  clear out the own Attributes from the deleted layers and shapes though.
- [ ] just display columns and utility variables in data. remove rows.
- [ ] heirarchy in side bar.
- [ ] check for cyclic reference in reference attributes
- [ ] remove dependency on whole of d3.
- [ ] the attribute editor UI sucks man.
- [ ] Memoize


#### FEEDBACK
- initialise each layer with different colour: colorbrewer palletes (?)
- add context(underlying data, dimensions, layer, etc) when rollover
- user scaffolding

# License

How do you add a license? Please help.

Till then licensed under "Do whatever the fuck you want with this".
