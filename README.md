# 2021-casciffo
Software Capacitation in Hospital Fernando Fonseca Research Centre
<div id="top"></div>
<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->



<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->



<!-- PROJECT LOGO -->
<br />
<div align="center">
  <h3 align="center">Casciffo</h3>

  <p align="center">
    Software developed to facilitate the management of clinical trials, making it easier to organize, keep track and manage patient attendance.
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#docker">Prerequisites</a></li>
        <li><a href="#locally">Installation</a></li>
      </ul>
    </li>
  <ol>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

CASCIFFO is a platform split in two modules, a front- and back-end module. This application that aims to develop and provide innovative mechanisms for interoperability with internal and external information systems, allowing, when desired, data synchronization, index search, identification data management and even access to detailed clinical data. Along with these features, the management of clinical visits assisted by researchers and data monitoring of patients are also included. 



<p align="right">(<a href="#top">back to top</a>)</p>



### Built With

This app was developed using these frameworks: 

* [Node.js](https://nodejs.org/en/download)
* [React.js](https://reactjs.org/)
* [Java](https://www.oracle.com/java/technologies/javase/jdk16-archive-downloads.html)
* [PostgreSQL](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads)
* [Spring Webflux](https://www.rabbitmq.com/)

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

To begin our journey within the CASCIFFO application, the following prerequisites need to be checked:  

#### Prerequisites

* Install Java 16+
* Install Node.js 18+ and NPM (compatible version with Node.js)
* Install Postgres 12 (Compatibility with other versions is not guaranteed)
* Install H2 (Optional - For running in-memory tests without needing a second Postgres database) 

#### Installation

After having installed all the required software:

1. Clone the repo
   ```sh
   git clone https://github.com/isel-sw-projects/2021-casciffo [folderName]
   ```
2. Create a Database, for example with the command line tool <i>psql</i>
    ```sh
    postgres pqsl createdb `dbName`
    ```
3. Create a Database user<br/>
   This can be done by using the PGAdmin or <i>psql</i> tool.
   The latter can be done in the command line with the following command.
   ```sh
    postgres create user -s `userName` -W
    [Password:] `password`
    postgres psql grant all priveleges on `dbName` to `userName`
   ```
4. Create Database Tables<br/>
   Open a command line UI inside the folder /setup and
   Run the command:
   ```sh
    postgres psql -f db_creation.sql
   ```
5. Package the project<br/>
   The setup is fully automatic and can be done by going into the /setup folder and running, depending on OS, the batch file (for windows) or the bash setup files (Linux/Ubuntu OS. Note that neither setup was tested or ran in MAC OS).
   There are two primary setup files, one that packages the application (letting the user run it manually) and one that packages and runs the application.
6. Configure the solution<br/>
   The configurations can be done when running the batch file that executes the application or manually via the command line by using the following options:
			-p		The port on which the app wil listen.
			-P		The postgres listening port.
			-d		The database name.
			-u		The database user name.
			-w		The password for the database user.
    Furthermore, you can also set them manually by editing the corresponding variables in the first few lines of the run script!
7. Run and enjoy!


---
Note: 
There may be a case where you need to give writing permissions to the folders and executables in order for them to work, either copy or run the permissions.sh script ヾ(•ω•`)o
If you wish to rename the database, you can do so in the .sql files in lines 19, 24, 27 and 29.

<p align="right">(<a href="#top">back to top</a>)</p>




<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- CONTACT -->
## Contact and Acknowledgements

This project was developed as part of a partnership between the Hospital Professor Doutor Fernando
Fonseca (HFF) and Lisbon School of Engineering (ISEL) 

Valdemar Antunes  -   A44865@alunos.isel.pt </br>
Miguel Gamboa     -   miguel.gamboa@isel.pt </br>
Pedro Vieira      -   pedro.vieira@isel.pt  </br>

Project Link: [https://github.com/isel-sw-projects/2021-casciffo](https://github.com/isel-sw-projects/2021-casciffo)


<p align="right">(<a href="#top">back to top</a>)</p>





<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/othneildrew/Best-README-Template.svg?style=for-the-badge
[contributors-url]: https://github.com/othneildrew/Best-README-Template/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/othneildrew/Best-README-Template.svg?style=for-the-badge
[forks-url]: https://github.com/othneildrew/Best-README-Template/network/members
[stars-shield]: https://img.shields.io/github/stars/othneildrew/Best-README-Template.svg?style=for-the-badge
[stars-url]: https://github.com/othneildrew/Best-README-Template/stargazers
[issues-shield]: https://img.shields.io/github/issues/othneildrew/Best-README-Template.svg?style=for-the-badge
[issues-url]: https://github.com/othneildrew/Best-README-Template/issues
[license-shield]: https://img.shields.io/github/license/othneildrew/Best-README-Template.svg?style=for-the-badge
[license-url]: https://github.com/othneildrew/Best-README-Template/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/othneildrew
[product-screenshot]: images/screenshot.png
