# PLAYGROUND

## UI nomenclature

The playground UI mainly consist of 4 resizable panes with the following layout.

`----`-----------`-----------`
|    |           |           |
| 1  |     2     |   3a/3b   |
|    |           |           |
|    |           |           |
`----`-----------`-----------`
|                            |
|           4a/4b            |
|                            |
`----------------------------`

- #### 1 Topic pane
That pane contains a navigable treeview component used to select the various topics.
The content is dynamically built at run-time as explained later in the **Write the documentation** section.

- #### 2 Guide pane
That pane contains the content (.md file) of the topic, fetched from the /content/guides directory throught the @nuxt/content module.

- #### 3a Code pane (optionally visible)
That pane it's only shown if a topic with a code filename metadata has been selected.
It shows an editable SDK code code block (for now python only).
It contain some button which make possible to **run** the example and update the merkle tree, or **reset** the merkle tree.

Two shortcuts are also available:
- Ctrl+Enter	run the example
- Ctrl+R		reset the merkle tree content (all data will be lost)

- #### 3b Code pane (optionally visible)
That pane it's only shown if a topic with a truthy live metadata has been selected.
It shows an interactive terminal that execute bash commands throught a Websocket connection.
Using this terminal is possible to use immuclient conencting with the dollowing credentials.
- user: immudb
- password: immudb

NB: The code is executed inside a volatile docker container which is closed 30 seconds after the user navigate to another route or close the playground tab.

- #### 4 Output pane
That pane contains two tabs, named:
- 41 Output
- 4b Merkle Tree

- #### 4a Output

This pane contains the results of executing an example from the code pane or the live pane

- #### 4b Merkle Tree

This pane render the resulting Merkle Tree from the execution an example from the code pane or the live pane

NB: Currently you can't continue building a Merkle Tree from the example code using hte live terminal and vice versa

## Manage the documentation

- Put .md files in `/client/content/guides` folder, adding subdirectories to build a multilevel treeview

The directory structure it's dynamically built at run time as a treeview.
There are some rules that need to be observed to build a correct treeview and render metadata.

#### metadata

Each .md file must start with a frontmatter headers with the following metadata

```bash
# required
title:		String				# the title of the guide

# optional
sort:		Number				# manage sorting items at same level
node:		Boolean				# declare the item as a node of the treeview (expandable item)
code:		String				# defnie the presence of a code example in the UI if truthy. The filename of the example code (doesn't need to specify the language name and mime type as those will be added at run time)
live:		Boolean				# define the presence of a live terminal in the UI if truthy
active: 	Boolean				# ignore the .md file if falsy

# variable usefule to be used in the same .md file 
code1: # import the client c
```
#### multilevel treeview (topic pane)

To build a multilevel treeview is needed to put them inside a directory (whose name is irrelevant) and add a special file in it at root level, called **index.md**.
That file title metadata will define tha name of the expandable item in the treeview. Only for that case it
s mandataroy to specifty **node: true**.

#### treeview icons (topic pane)

The treeview items will have on their left an icon representing the type of data shown when they're active.
- Book: a simple UI with just a guide pane on the right
- Code: an UI with both a guide pane and a code pane on the right
- Live terminal: an UI with both a guide pane and a live teraminl on the right 

## Run the playground

Prerequirement: install git and latest Node.js LTS version.

```bash
# install dependencies
$ npm i

# serve with hot reload at localhost:8080
$ npm run dev

```

The preview website on localhost:8080 will reflect changes everytime a .md file is updated and saved (live reload).

## Build Setup

```bash
# install dependencies
$ npm i

# serve with hot reload at localhost:8081
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).
