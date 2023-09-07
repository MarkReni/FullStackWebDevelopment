```mermaid
sequenceDiagram
    participant browser
    participant server

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    

    Note right of browser: The server does not ask for a redirect, the browser stays on the same page, and it sends no further HTTP requests.
    ```