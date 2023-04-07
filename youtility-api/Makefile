build:
	docker build --tag youtility-api .

run:
	docker run -p 8080:8080 youtility-api 

deploy:
	az webapp up --runtime GO:1.19 --os linux --sku B1 --name=youtility-api

delete-deploy:
	az group delete --resource-group altamashattari786_rg_6706