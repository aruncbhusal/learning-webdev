### Installing Git Bash

> On Mac, Bash is available and used as the terminal by default, so we must install it in the case of Windows
> In order to install Git Bash we can go to [this website](https://gitforwindows.org/) and install it following all instructions

After installation, we can set it as the default terminal inside VS Code to be able to use it each time we open a new terminal.

It shows up with a **$** sign on the start of the line

### What is the Bash Shell?

**A Shell** is an interface by which a user can interact with the kernel of the Operating System, the kernel is the core part which handles all hardware.

Shells are command line interfaces (CLI) instead of Graphical User Interfaces (GUI). Windows has Command Prompt, Powershell as shells.

**Bash** stands for _Bourne Again Shell_ and it is the default shell of UNIX and UNIX-like operating systems, like Linux and MacOS. Windows is based on DOS.

We prefer shells instead of grpahical interfaces because of the power they give, and the shortcuts they have, their high power ceiling, and a more liberal control.

### What can we do using Bash?

A lot of things, creating a directory(folder) inside the current one is just `mkdir newFolder`.

We can even create hidden folders with a dot before the name `mkdir .secretFolder`.

And to see all the files in the current folder we just need to use `ls -a`. This also shows the secret/hidden files and folders.

### Using the Terminal

#### 1. List Files and Directories (ls)

This command can be used to list all the files and directories in the current folder.

In the beginning, we're inside the root folder located at `C:\\Users\<yourname>\` (for windows, similar for Mac).

(Not mentioned in the course yet but if we open bash in VS Code when inside a folder with git enabled, the root will be the current working directory)

From this directory, we can go to the documents, downloads, and any other folders inside there.

### 2. Change Directory (cd)

This command is used to move from one location to another. When we give a folder name only, we move forward inside the current directory eg.

```bash
cd Downloads
```

takes me to root/Downloads, we can use `Tab` key to autocomplete the folder name. I have a folder called `test` inside it so I can now do

```bash
cd test
```

But going one folder at a time is tedious, we have a better way to do this, first let's return to the root directory. We can use

```bash
cd ~
```

to return to the root directory from where we can use

```bash
cd Downloads/test
```

to go inside the test folder directly. But what if we enter the wrong folder. Since we can only move forward with this,
we need to specify the whole path if we want to go to a specific folder. But we can move backward as well using:

```bash
cd ..
```

This brings us one step backward to the parent directory of current directory.

We sometimes may not know where we are, in that case we can use `pwd` which stands for present working directory

```bash
pwd
```

We might also have errors during our command, and need to fix it, but clicking with mouse dooesn't change cursor position.

We can simply use `Alt+Click` to move the cursor to the desired position. People who use terminal often don't like to touch the mouse.

We can use `Ctrl+A` to move to the start of current command, `Ctrl+E` to move to the end, `Ctrl+U` to clear the command before executing.

Furthermore, we can use Arrow up and Arrow donw keys to scroll through our terminal history, if we need to repeat any command again.

#### 3. Creating and deleting files and folders

In the GUI we need to do clicking, navigating, and such in order to make folders, files, etc, but it is simple with the shell.
We can simply use the mkdir command to create a new folder in the current directory. So what if I wanted to create a new folder inside `test` from the root folder

```bash
cd Downloads/test
mkdir newFolder
```

Now if we `ls` here, we can see the new folder. Let's create a new text file inside. We can simply use `touch <filename>` to do so

```bash
cd newFolder
touch newText.txt
```

We can then open this file using the `open` command in zsh and `start` in bash and it will open in default app to handle it

```bash
start newText.txt
```

We can also use `-a` after the command on Mac to select an Application to open in. If we want to open the text file in VS Code in windows:

```bash
code newText.txt
```

We can remove the file using `rm` command, if we want to delete every file in the current folder we can simply do `rm *`. To delete the text file:

```bash
rm newText.txt
```

What if we wanted to remove the newFolder folder itself. Using rm on it will only give us "It is a directory" error, so we can instead use:

```bash
cd ..
rm -r newFolder
```

This removes the folder along with any folders/files inside it. We can also use `rm -rf` where f means forced.

Though we have much power using these commands, we must be careful using them because we may accidentally delete important/system files in the process.

We can look at tutorials like [Command Line Tutorial](https://learnenough.com/command-line-tutorial) to learn more about commands.
