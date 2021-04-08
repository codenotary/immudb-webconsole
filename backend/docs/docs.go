// GENERATED BY THE COMMAND ABOVE; DO NOT EDIT
// This file was generated by swaggo/swag

package docs

import (
	"bytes"
	"encoding/json"
	"strings"

	"github.com/alecthomas/template"
	"github.com/swaggo/swag"
)

var doc = `{
    "schemes": {{ marshal .Schemes }},
    "swagger": "2.0",
    "info": {
        "description": "{{.Description}}",
        "title": "{{.Title}}",
        "termsOfService": "http://codenotary.com/terms",
        "contact": {
            "name": "API Support",
            "url": "http://www.swagger.io/support",
            "email": "support@swagger.io"
        },
        "license": {
            "name": "Apache 2.0",
            "url": "http://www.apache.org/licenses/LICENSE-2.0.html"
        },
        "version": "{{.Version}}"
    },
    "host": "{{.Host}}",
    "basePath": "{{.BasePath}}",
    "paths": {
        "/exec/logs": {
            "get": {
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "player"
                ],
                "summary": "Return last 16 container run logs",
                "operationId": "execLog",
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/main.runLog"
                        }
                    }
                }
            }
        },
        "/exec/python": {
            "post": {
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "player"
                ],
                "summary": "Execute a python script",
                "operationId": "pythonExec",
                "parameters": [
                    {
                        "description": "Run request",
                        "name": "request",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/main.runRequest"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/main.runResponse"
                        }
                    },
                    "400": {
                        "description": ""
                    },
                    "500": {
                        "description": ""
                    }
                }
            }
        },
        "/info/version": {
            "get": {
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "info"
                ],
                "summary": "Show software version",
                "operationId": "showVersion",
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/main.versionInfo"
                        }
                    }
                }
            }
        },
        "/run/close/{id}": {
            "post": {
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "runner"
                ],
                "summary": "Halts and delete an interactive container",
                "operationId": "closeRunner",
                "parameters": [
                    {
                        "type": "string",
                        "description": "Container id",
                        "name": "id",
                        "in": "path",
                        "required": true
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/main.runnerResponse"
                        }
                    },
                    "400": {
                        "description": "Bad Request",
                        "schema": {
                            "$ref": "#/definitions/main.runnerResponse"
                        }
                    },
                    "500": {
                        "description": "Internal Server Error",
                        "schema": {
                            "$ref": "#/definitions/main.runnerResponse"
                        }
                    }
                }
            }
        },
        "/run/list": {
            "get": {
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "runner"
                ],
                "summary": "List containers ids of running containers for interactive ouse",
                "operationId": "listRunners",
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/main.listrunnerResponse"
                        }
                    },
                    "400": {
                        "description": ""
                    },
                    "500": {
                        "description": ""
                    }
                }
            }
        },
        "/run/new": {
            "post": {
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "runner"
                ],
                "summary": "Launch a new container for interactive use",
                "operationId": "newRunner",
                "parameters": [
                    {
                        "description": "Run request",
                        "name": "request",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/main.runRequest"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/main.runnerResponse"
                        }
                    },
                    "400": {
                        "description": ""
                    },
                    "500": {
                        "description": ""
                    }
                }
            }
        }
    },
    "definitions": {
        "main.OutputLine": {
            "type": "object",
            "properties": {
                "flux": {
                    "description": "type=console",
                    "type": "string"
                },
                "immudb": {
                    "description": "type=immudb",
                    "type": "array",
                    "items": {
                        "type": "integer"
                    }
                },
                "line": {
                    "type": "string"
                },
                "timestamp": {
                    "type": "number"
                },
                "token": {
                    "type": "array",
                    "items": {
                        "type": "integer"
                    }
                },
                "tree": {
                    "type": "array",
                    "items": {
                        "type": "integer"
                    }
                },
                "type": {
                    "description": "{console|immudb}",
                    "type": "string"
                },
                "verified": {
                    "type": "boolean"
                }
            }
        },
        "main.listrunnerResponse": {
            "type": "object",
            "properties": {
                "ids": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                }
            }
        },
        "main.runLog": {
            "type": "object",
            "properties": {
                "lines": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/main.runLogLine"
                    }
                },
                "size": {
                    "type": "integer"
                }
            }
        },
        "main.runLogLine": {
            "type": "object",
            "properties": {
                "container": {
                    "type": "string"
                },
                "label": {
                    "type": "string"
                },
                "logentry": {
                    "type": "string"
                },
                "timestamp": {
                    "type": "number"
                }
            }
        },
        "main.runRequest": {
            "type": "object",
            "properties": {
                "code": {
                    "type": "string"
                },
                "immudb": {
                    "type": "array",
                    "items": {
                        "type": "integer"
                    }
                },
                "token": {
                    "type": "array",
                    "items": {
                        "type": "integer"
                    }
                }
            }
        },
        "main.runResponse": {
            "type": "object",
            "properties": {
                "immudb": {
                    "type": "array",
                    "items": {
                        "type": "integer"
                    }
                },
                "output": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/main.OutputLine"
                    }
                },
                "token": {
                    "type": "array",
                    "items": {
                        "type": "integer"
                    }
                },
                "tree": {
                    "type": "array",
                    "items": {
                        "type": "integer"
                    }
                },
                "verified": {
                    "type": "boolean"
                }
            }
        },
        "main.runnerResponse": {
            "type": "object",
            "properties": {
                "error": {
                    "type": "string"
                },
                "id": {
                    "type": "string"
                },
                "status": {
                    "type": "string"
                }
            }
        },
        "main.versionInfo": {
            "type": "object",
            "properties": {
                "buildtime": {
                    "type": "string"
                },
                "version": {
                    "type": "string"
                }
            }
        }
    }
}`

type swaggerInfo struct {
	Version     string
	Host        string
	BasePath    string
	Schemes     []string
	Title       string
	Description string
}

// SwaggerInfo holds exported Swagger Info so clients can modify it
var SwaggerInfo = swaggerInfo{
	Version:     "1.0",
	Host:        "",
	BasePath:    "/api/v1",
	Schemes:     []string{},
	Title:       "Playground REST server",
	Description: "This is a PoC playground rest server",
}

type s struct{}

func (s *s) ReadDoc() string {
	sInfo := SwaggerInfo
	sInfo.Description = strings.Replace(sInfo.Description, "\n", "\\n", -1)

	t, err := template.New("swagger_info").Funcs(template.FuncMap{
		"marshal": func(v interface{}) string {
			a, _ := json.Marshal(v)
			return string(a)
		},
	}).Parse(doc)
	if err != nil {
		return doc
	}

	var tpl bytes.Buffer
	if err := t.Execute(&tpl, sInfo); err != nil {
		return doc
	}

	return tpl.String()
}

func init() {
	swag.Register(swag.Name, &s{})
}
