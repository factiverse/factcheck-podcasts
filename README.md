# Factchecking Podcasts 

## To run the server 

* Clone this repository
    -  ```bash
            git clone https://github.com/factiverse/factcheck-podcasts
       ```
* Run docker
    - ```bash
        cd src
      ```
    - ```bash
        docker-compose up -d
      ```

 ## Frontend

To run the frontend, follow these steps:

1. Navigate to the `src/frontend` directory:
    ```bash
    cd src/frontend
    ```
2. Install the dependencies:
    ```bash
    npm install
    ```
3. Start the development server:
    ```bash
    npm start
    ```

## Dataset

Dataset use in this paper can be found under `data` folder

    
## Reference

If you are using this tool or dataset, please cite this paper.

```
@inproceedings{Setty:2025:WWW,
  title        = {Annotation Tool and Dataset for Fact-Checking Podcasts},
  author       = {Setty, Vinay and Becker, Adam James},
  booktitle    = {Companion Proceedings of the ACM on Web Conference 2025},
  year         = {2025},
  pages        = {789–792},
  series       = {WWW Companion ’25}
  doi          = {10.1145/3701716.3715312}
}
```
