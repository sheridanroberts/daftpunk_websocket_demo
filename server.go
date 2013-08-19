package main 

import (
	"code.google.com/p/go.net/websocket"
	"net/http"
	"flag"
	"fmt"
	"os"
)

type hub struct {
	connections map[*connection]bool
	broadcast chan string
	register chan *connection
	unregister chan *connection	
}

func (h *hub) run() {
	for {
		select {
		case c := <-h.register:
			h.connections[c] = true
			fmt.Println("Accepted client: ", c)
		case c := <-h.unregister:
			fmt.Println("Removing client: ", c)
			delete(h.connections, c)
			close(c.send)
		case m := <-h.broadcast:
			for c := range h.connections {
				select {
				case c.send <- m:
				default:
					delete(h.connections, c)
					close(c.send)
					go c.ws.Close()
				}
			}
		}
	}
}

type connection struct {
	ws *websocket.Conn
	send chan string
}

func (c *connection) reader() {
	for {
		var message [256]byte
		n, err := c.ws.Read(message[:])
		if err != nil {
			break
		}
		h.broadcast <- string(message[:n])
		fmt.Println("Broadcasting: ", string(message[:n]))
	}
	fmt.Println("Closing websocket in reader()...")
	c.ws.Close()
}

func (c *connection) writer() {
	for message := range c.send {
		err := websocket.Message.Send(c.ws, message)
		if err != nil {
			break
		}
	}
	fmt.Println("Closing websocket in writer()...")
	c.ws.Close()
}

func wsHandler(ws *websocket.Conn) {
	c := &connection{send: make(chan string, 256), ws: ws}
	h.register <- c
	defer func() {
		h.unregister <- c
	}()
	go c.writer()
	c.reader()
}

var h = hub {
	broadcast: make(chan string),
	register: make(chan *connection),
	unregister: make(chan *connection),
	connections: make(map[*connection]bool),
}

var myWSServer = &websocket.Server {
	Handler: wsHandler,
	Handshake: func(config *websocket.Config, req *http.Request) error {
		return nil
	},
}

var addr = flag.String("addr", ":8080", "http websocket service")

func main() {
	go h.run()
	http.Handle("/", myWSServer)
	if err := http.ListenAndServe(*addr, nil); err != nil {
		fmt.Println("Error with server. Shutting down...\n", err)
		os.Exit(-1)
	}
}