all: build push clean
	
TAG = 0.02

build: ws_node
	docker build -t registry.aliyuncs.com/marvingod/ws-node:$(TAG) .

push:
	docker push registry.aliyuncs.com/marvingod/ws-node:$(TAG)
	
ws_node: 
	GOOS=linux GOARCH=amd64 go build html5/room_service/ws_node
	
clean:
	rm ws_node