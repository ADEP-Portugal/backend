import tkinter as tk
from tkinter import ttk, filedialog, messagebox, scrolledtext
import subprocess
import os
import threading
import re
import queue
import time
import socket
import io
from PIL import Image, ImageTk
import qrcode

class AndroidFileTransfer:
    def __init__(self):
        self.root = tk.Tk()
        self.root.title("Transferência de Arquivos Android")
        self.root.geometry("800x600")
        self.root.resizable(True, True)
        
        self.adb_path = r"C:\Users\Administrador\AppData\Local\Android\Sdk\platform-tools"
        self.devices = []
        self.folders = []
        self.selected_folders = []
        self.destination_folder = ""
        self.cancel_transfer_flag = False
        self.transfer_process = None
        self.output_queue = queue.Queue()
        
        self.setup_ui()
        self.load_devices()
        
        # Iniciar thread para atualizar o terminal
        threading.Thread(target=self.update_terminal_output, daemon=True).start()
        
        self.root.mainloop()
    
    def setup_ui(self):
        # Criar container principal com scroll
        self.main_container = tk.Frame(self.root)
        self.main_container.pack(fill=tk.BOTH, expand=True)
        
        # Canvas que permitirá rolagem
        self.canvas = tk.Canvas(self.main_container)
        
        # Scrollbars vertical e horizontal
        self.vsb = ttk.Scrollbar(self.main_container, orient=tk.VERTICAL, command=self.canvas.yview)
        self.hsb = ttk.Scrollbar(self.main_container, orient=tk.HORIZONTAL, command=self.canvas.xview)
        
        # Configurar canvas para responder aos scrollbars
        self.canvas.configure(yscrollcommand=self.vsb.set, xscrollcommand=self.hsb.set)
        
        # Posicionar os componentes
        self.vsb.pack(side=tk.RIGHT, fill=tk.Y)
        self.hsb.pack(side=tk.BOTTOM, fill=tk.X)
        self.canvas.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        
        # Frame interno que será rolável
        self.scrollable_frame = ttk.Frame(self.canvas)
        
        # Adicionar o frame ao canvas
        self.canvas_frame = self.canvas.create_window((0, 0), window=self.scrollable_frame, anchor="nw")
        
        # Configurar eventos para redimensionamento
        self.scrollable_frame.bind("<Configure>", self.on_frame_configure)
        self.canvas.bind("<Configure>", self.on_canvas_configure)
        
        # Configurar rolagem com mouse wheel
        self.scrollable_frame.bind_all("<MouseWheel>", self.on_mousewheel)
        
        # Frame principal agora é o scrollable_frame
        main_frame = ttk.Frame(self.scrollable_frame, padding=10)
        main_frame.pack(fill=tk.BOTH, expand=True)
        
        # Notebook para abas (Conexão USB e Conexão Wi-Fi)
        self.notebook = ttk.Notebook(main_frame)
        self.notebook.pack(fill=tk.BOTH, expand=True, pady=5)
        
        # Aba para conexão USB (padrão)
        usb_frame = ttk.Frame(self.notebook)
        self.notebook.add(usb_frame, text="Conexão USB")
        
        # Aba para conexão Wi-Fi
        wifi_frame = ttk.Frame(self.notebook)
        self.notebook.add(wifi_frame, text="Conexão Wi-Fi")
        
        # Configurar interface USB
        self.setup_usb_interface(usb_frame)
        
        # Configurar interface Wi-Fi
        self.setup_wifi_interface(wifi_frame)
        
    def on_frame_configure(self, event):
        """Função chamada quando o tamanho do frame interno muda"""
        self.canvas.configure(scrollregion=self.canvas.bbox("all"))
        
    def on_canvas_configure(self, event):
        """Função chamada quando o tamanho do canvas muda"""
        # Ajustar o tamanho do frame interno à largura do canvas
        self.canvas.itemconfig(self.canvas_frame, width=event.width)
    
    def on_mousewheel(self, event):
        """Função para rolar com o mousewheel"""
        self.canvas.yview_scroll(int(-1*(event.delta/120)), "units")
        
    def setup_usb_interface(self, parent_frame):
        # Criar notebook para seleção de direção da transferência
        direction_notebook = ttk.Notebook(parent_frame)
        direction_notebook.pack(fill=tk.BOTH, expand=True)
        
        # Aba para transferência Android -> Windows
        android_to_windows_frame = ttk.Frame(direction_notebook)
        direction_notebook.add(android_to_windows_frame, text="Android → Windows")
        
        # Aba para transferência Windows -> Android
        windows_to_android_frame = ttk.Frame(direction_notebook)
        direction_notebook.add(windows_to_android_frame, text="Windows → Android")
        
        # Configurar interface para transferência Android -> Windows (funcionalidade original)
        self.setup_android_to_windows(android_to_windows_frame)
        
        # Configurar interface para transferência Windows -> Android (nova funcionalidade)
        self.setup_windows_to_android(windows_to_android_frame)
        
    def setup_android_to_windows(self, parent_frame):
        # Painel superior para controles
        upper_panel = ttk.PanedWindow(parent_frame, orient=tk.VERTICAL)
        upper_panel.pack(fill=tk.BOTH, expand=True)
        
        # Frame de controles
        control_frame = ttk.Frame(upper_panel)
        upper_panel.add(control_frame, weight=1)
        
        # Seleção de dispositivo
        device_frame = ttk.LabelFrame(control_frame, text="Dispositivo Android", padding=5)
        device_frame.pack(fill=tk.X, pady=5)
        
        ttk.Label(device_frame, text="Selecione o dispositivo:").grid(row=0, column=0, sticky=tk.W)
        self.device_combo = ttk.Combobox(device_frame, width=50, state="readonly")
        self.device_combo.grid(row=0, column=1, padx=5, sticky=tk.W)
        self.device_combo.bind("<<ComboboxSelected>>", self.on_device_selected)
        
        refresh_button = ttk.Button(device_frame, text="Atualizar", command=self.load_devices)
        refresh_button.grid(row=0, column=2, padx=5)
        
        # Frame para navegação de arquivos
        file_explorer_frame = ttk.LabelFrame(control_frame, text="Navegador de Arquivos Android", padding=5)
        file_explorer_frame.pack(fill=tk.BOTH, expand=True, pady=5)
        
        # Frame para o caminho atual e navegação
        path_frame = ttk.Frame(file_explorer_frame)
        path_frame.pack(fill=tk.X, pady=2)
        
        ttk.Label(path_frame, text="Caminho:").pack(side=tk.LEFT, padx=5)
        self.current_path_var = tk.StringVar(value="/sdcard/")
        self.current_path_entry = ttk.Entry(path_frame, textvariable=self.current_path_var, width=50)
        self.current_path_entry.pack(side=tk.LEFT, fill=tk.X, expand=True, padx=5)
        
        go_button = ttk.Button(path_frame, text="Ir", command=self.navigate_to_path)
        go_button.pack(side=tk.LEFT, padx=5)
        
        up_button = ttk.Button(path_frame, text="Voltar", command=self.navigate_up)
        up_button.pack(side=tk.LEFT, padx=5)
        
        # Frame para a lista de itens e botões de seleção
        browse_frame = ttk.Frame(file_explorer_frame)
        browse_frame.pack(fill=tk.BOTH, expand=True, pady=5)
        
        # Lista de itens (arquivos e pastas)
        items_frame = ttk.Frame(browse_frame)
        items_frame.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        
        # Label para instruções
        ttk.Label(items_frame, text="Clique duplo para navegar nas pastas:").pack(anchor=tk.W)
        
        # Treeview para exibir arquivos e pastas
        columns = ('name', 'type', 'size', 'date')
        self.items_tree = ttk.Treeview(items_frame, columns=columns, show='headings', selectmode='extended')
        
        # Configurar colunas e cabeçalhos
        self.items_tree.heading('name', text='Nome')
        self.items_tree.heading('type', text='Tipo')
        self.items_tree.heading('size', text='Tamanho')
        self.items_tree.heading('date', text='Data')
        
        self.items_tree.column('name', width=250)
        self.items_tree.column('type', width=80)
        self.items_tree.column('size', width=100)
        self.items_tree.column('date', width=150)
        
        # Vincular evento de clique duplo para navegação
        self.items_tree.bind("<Double-1>", self.on_item_double_click)
        
        # Scrollbars
        vsb = ttk.Scrollbar(items_frame, orient="vertical", command=self.items_tree.yview)
        hsb = ttk.Scrollbar(items_frame, orient="horizontal", command=self.items_tree.xview)
        self.items_tree.configure(yscrollcommand=vsb.set, xscrollcommand=hsb.set)
        
        vsb.pack(side=tk.RIGHT, fill=tk.Y)
        hsb.pack(side=tk.BOTTOM, fill=tk.X)
        self.items_tree.pack(fill=tk.BOTH, expand=True)
        
        # Botões para adicionar/remover itens da seleção
        buttons_frame = ttk.Frame(browse_frame)
        buttons_frame.pack(side=tk.LEFT, padx=5, fill=tk.Y)
        
        add_button = ttk.Button(buttons_frame, text="Adicionar >", command=self.add_selected_items)
        add_button.pack(pady=5)
        
        remove_button = ttk.Button(buttons_frame, text="< Remover", command=self.remove_selected_transfers)
        remove_button.pack(pady=5)
        
        # Lista de itens selecionados para transferência
        selected_frame = ttk.Frame(browse_frame)
        selected_frame.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        
        ttk.Label(selected_frame, text="Itens selecionados para transferência:").pack(anchor=tk.W)
        
        self.transfer_list = tk.Listbox(selected_frame, selectmode=tk.MULTIPLE)
        
        # Scrollbars para lista de transferência
        transfer_vsb = ttk.Scrollbar(selected_frame, orient="vertical", command=self.transfer_list.yview)
        self.transfer_list.configure(yscrollcommand=transfer_vsb.set)
        
        transfer_vsb.pack(side=tk.RIGHT, fill=tk.Y)
        self.transfer_list.pack(fill=tk.BOTH, expand=True)
        
        # Pasta de destino
        dest_frame = ttk.LabelFrame(control_frame, text="Pasta de Destino", padding=5)
        dest_frame.pack(fill=tk.X, pady=5)
        
        self.dest_entry = ttk.Entry(dest_frame, width=60)
        self.dest_entry.pack(side=tk.LEFT, padx=5, fill=tk.X, expand=True)
        
        browse_button = ttk.Button(dest_frame, text="Procurar", command=self.browse_destination)
        browse_button.pack(side=tk.RIGHT, padx=5)
        
        open_folder_button = ttk.Button(dest_frame, text="Abrir Pasta", command=self.open_destination_folder)
        open_folder_button.pack(side=tk.RIGHT, padx=5)
        
        # Terminal
        terminal_frame = ttk.LabelFrame(parent_frame, text="Terminal", padding=5)
        terminal_frame.pack(fill=tk.BOTH, expand=True, pady=5)
        
        self.terminal = scrolledtext.ScrolledText(terminal_frame, wrap=tk.WORD, height=10, 
                                                background="black", foreground="white")
        self.terminal.pack(fill=tk.BOTH, expand=True)
        
        # Barra de progresso
        progress_frame = ttk.Frame(parent_frame, padding=5)
        progress_frame.pack(fill=tk.X, pady=5)
        
        self.progress = ttk.Progressbar(progress_frame, orient=tk.HORIZONTAL, length=100, mode='determinate')
        self.progress.pack(fill=tk.X, padx=5)
        
        self.status_label = ttk.Label(progress_frame, text="Pronto")
        self.status_label.pack(pady=5)
        
        # Estatísticas de Transferência
        stats_frame = ttk.LabelFrame(parent_frame, text="Estatísticas de Transferência", padding=5)
        stats_frame.pack(fill=tk.X, pady=5, padx=5)
        
        # Tabela de estatísticas
        stats_grid = ttk.Frame(stats_frame)
        stats_grid.pack(fill=tk.X, pady=2)
        
        # Linha 1
        ttk.Label(stats_grid, text="Velocidade média:").grid(row=0, column=0, sticky=tk.W, padx=5, pady=2)
        self.speed_label = ttk.Label(stats_grid, text="0 MB/s")
        self.speed_label.grid(row=0, column=1, sticky=tk.W, padx=5, pady=2)
        
        ttk.Label(stats_grid, text="Total de pastas:").grid(row=0, column=2, sticky=tk.W, padx=5, pady=2)
        self.total_folders_label = ttk.Label(stats_grid, text="0")
        self.total_folders_label.grid(row=0, column=3, sticky=tk.W, padx=5, pady=2)
        
        # Linha 2
        ttk.Label(stats_grid, text="Total de arquivos:").grid(row=1, column=0, sticky=tk.W, padx=5, pady=2)
        self.total_files_label = ttk.Label(stats_grid, text="0")
        self.total_files_label.grid(row=1, column=1, sticky=tk.W, padx=5, pady=2)
        
        ttk.Label(stats_grid, text="Total transferido:").grid(row=1, column=2, sticky=tk.W, padx=5, pady=2)
        self.total_size_label = ttk.Label(stats_grid, text="0 MB")
        self.total_size_label.grid(row=1, column=3, sticky=tk.W, padx=5, pady=2)
        
        # Contadores de Sucessos e Falhas
        counters_frame = ttk.LabelFrame(parent_frame, text="Resultados da Transferência", padding=5)
        counters_frame.pack(fill=tk.X, pady=5, padx=5)
        
        ttk.Label(counters_frame, text="Transferências bem-sucedidas:").grid(row=0, column=0, sticky=tk.W, padx=5, pady=2)
        self.success_count_label = ttk.Label(counters_frame, text="0")
        self.success_count_label.grid(row=0, column=1, sticky=tk.W, padx=5, pady=2)
        
        ttk.Label(counters_frame, text="Falhas na transferência:").grid(row=1, column=0, sticky=tk.W, padx=5, pady=2)
        self.failure_count_label = ttk.Label(counters_frame, text="0")
        self.failure_count_label.grid(row=1, column=1, sticky=tk.W, padx=5, pady=2)
        
        # Lista de falhas
        ttk.Label(counters_frame, text="Pastas com falha:").grid(row=2, column=0, sticky=tk.NW, padx=5, pady=2)
        
        failure_frame = ttk.Frame(counters_frame)
        failure_frame.grid(row=2, column=1, sticky=tk.W, padx=5, pady=2)
        
        self.failed_folders_text = tk.Text(failure_frame, wrap=tk.WORD, height=3, width=40, state=tk.DISABLED)
        self.failed_folders_text.pack(side=tk.LEFT, fill=tk.BOTH)
        
        failure_scrollbar = ttk.Scrollbar(failure_frame, command=self.failed_folders_text.yview)
        failure_scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
        self.failed_folders_text.config(yscrollcommand=failure_scrollbar.set)
        
        # Botões de controle
        button_frame = ttk.Frame(parent_frame)
        button_frame.pack(pady=10)
        
        self.start_button = ttk.Button(button_frame, text="Iniciar Transferência", command=self.start_transfer)
        self.start_button.pack(side=tk.LEFT, padx=5)
        
        self.cancel_button = ttk.Button(button_frame, text="Cancelar", command=self.cancel_transfer, state=tk.DISABLED)
        self.cancel_button.pack(side=tk.LEFT, padx=5)
        
        # Inicializa o dicionário para armazenar itens selecionados
        self.selected_items = {}
    
    def on_device_selected(self, event):
        """Quando um dispositivo é selecionado, atualiza o explorador de arquivos"""
        self.current_path_var.set("/sdcard/")
        self.load_items_in_path("/sdcard/")
    
    def navigate_to_path(self):
        """Navega para um caminho específico inserido pelo usuário"""
        path = self.current_path_var.get()
        self.load_items_in_path(path)
    
    def navigate_up(self):
        """Navega para o diretório pai"""
        current_path = self.current_path_var.get()
        if current_path == "/sdcard/" or current_path == "/sdcard":
            return  # Já estamos na raiz permitida
            
        parent_path = os.path.dirname(current_path.rstrip('/'))
        if not parent_path or parent_path == "/":
            parent_path = "/sdcard"
            
        self.current_path_var.set(parent_path)
        self.load_items_in_path(parent_path)
    
    def on_item_double_click(self, event):
        """Manipula o evento de clique duplo em um item da treeview"""
        selected_item = self.items_tree.selection()
        if not selected_item:
            return
            
        item_values = self.items_tree.item(selected_item[0], 'values')
        item_name = item_values[0]
        item_type = item_values[1]
        
        current_path = self.current_path_var.get()
        if current_path[-1] != "/":
            current_path += "/"
        
        if item_type == "Pasta":
            new_path = current_path + item_name
            self.current_path_var.set(new_path)
            self.load_items_in_path(new_path)
    
    def create_process(self, cmd):
        """Cria um processo com configuração adequada para lidar com caracteres especiais"""
        return subprocess.Popen(
            cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            bufsize=1,
            universal_newlines=True,
            encoding='utf-8',      # Definir codificação UTF-8
            errors='replace'       # Substituir caracteres não decodificáveis
        )
    
    def normalize_path(self, path):
        """Normaliza o caminho para evitar problemas com caracteres especiais"""
        try:
            # Para nomes de arquivos que contêm caracteres especiais
            return path
        except:
            return path
    
    def load_items_in_path(self, path):
        """Carrega arquivos e pastas no caminho especificado"""
        if not self.device_combo.get():
            messagebox.showwarning("Aviso", "Selecione um dispositivo primeiro.")
            return
        
        # Limpar a treeview
        for item in self.items_tree.get_children():
            self.items_tree.delete(item)
            
        try:
            device_id = self.device_combo.get()
            self.add_to_terminal(f"Listando itens em {path}")
            
            # Nova abordagem: usar um comando mais direto para listar diretórios
            # Usar printf para formatar a saída de maneira previsível com separadores claros
            cmd_folders = [os.path.join(self.adb_path, "adb"), "-s", device_id, 
                         "shell", f'find "{path}" -maxdepth 1 -type d -not -path "{path}" -exec basename {{}} \\;']
            
            self.add_to_terminal(f"Executando: {' '.join(cmd_folders)}")
            
            # Usar o método create_process em vez de subprocess.run
            process_folders = self.create_process(cmd_folders)
            folders_output = ""
            for line in process_folders.stdout:
                folders_output += line
            
            # Listar arquivos: obter nome e informações separadamente para evitar problemas de parsing
            cmd_files = [os.path.join(self.adb_path, "adb"), "-s", device_id, 
                       "shell", f'find "{path}" -maxdepth 1 -type f -exec basename {{}} \\;']
            
            self.add_to_terminal(f"Executando: {' '.join(cmd_files)}")
            
            process_files = self.create_process(cmd_files)
            files_output = ""
            for line in process_files.stdout:
                files_output += line
            
            # Processar e exibir pastas
            folders = []
            for folder_name in folders_output.strip().split('\n'):
                if folder_name.strip() and folder_name not in [".", ".."]:
                    # Obter data de modificação
                    date_cmd = [os.path.join(self.adb_path, "adb"), "-s", device_id, 
                              "shell", f'stat -c "%y" "{path}/{folder_name}"']
                    date_result = self.create_process(date_cmd)
                    date_output = ""
                    for line in date_result.stdout:
                        date_output += line
                    
                    modified_date = date_output.strip() if date_output.strip() else "N/A"
                    
                    # Adicionar à lista e à treeview
                    folders.append(folder_name)
                    self.items_tree.insert('', 'end', values=(folder_name, "Pasta", "", modified_date[:19]))
            
            # Processar e exibir arquivos
            files = []
            for file_name in files_output.strip().split('\n'):
                if file_name.strip():
                    # Obter tamanho do arquivo
                    size_cmd = [os.path.join(self.adb_path, "adb"), "-s", device_id, 
                             "shell", f'stat -c "%s" "{path}/{file_name}"']
                    size_result = self.create_process(size_cmd)
                    size_output = ""
                    for line in size_result.stdout:
                        size_output += line
                    
                    file_size = size_output.strip() if size_output.strip() else "0"
                    try:
                        formatted_size = self.format_size(int(file_size))
                    except:
                        formatted_size = "N/A"
                    
                    # Obter data de modificação
                    date_cmd = [os.path.join(self.adb_path, "adb"), "-s", device_id, 
                             "shell", f'stat -c "%y" "{path}/{file_name}"']
                    date_result = self.create_process(date_cmd)
                    date_output = ""
                    for line in date_result.stdout:
                        date_output += line
                    
                    modified_date = date_output.strip() if date_output.strip() else "N/A"
                    
                    # Determinar o tipo de arquivo
                    file_ext = os.path.splitext(file_name)[1][1:].upper() if os.path.splitext(file_name)[1] else "Arquivo"
                    
                    # Adicionar à lista e à treeview
                    files.append(file_name)
                    self.items_tree.insert('', 'end', values=(file_name, file_ext, formatted_size, modified_date[:19]))
            
            self.add_to_terminal(f"Foram encontrados {len(folders)} pastas e {len(files)} arquivos")
            
        except Exception as e:
            error_msg = f"Erro ao listar itens: {e}"
            messagebox.showerror("Erro", error_msg)
            self.add_to_terminal(f"ERRO: {error_msg}")
    
    def add_selected_items(self):
        """Adiciona os itens selecionados na treeview à lista de transferência"""
        selected_items = self.items_tree.selection()
        if not selected_items:
            messagebox.showinfo("Informação", "Selecione pelo menos um item para adicionar.")
            return
        
        current_path = self.current_path_var.get()
        if current_path[-1] != "/":
            current_path += "/"
        
        for item_id in selected_items:
            item_values = self.items_tree.item(item_id, 'values')
            item_name = item_values[0]
            item_type = item_values[1]
            
            # Escapar caracteres especiais no caminho
            item_path = f"{current_path}{item_name}"
            
            # Verificar se o item já está na lista
            if item_path not in self.selected_items:
                self.selected_items[item_path] = item_type
                display_text = f"{item_path} ({item_type})"
                self.transfer_list.insert(tk.END, display_text)
                self.add_to_terminal(f"Adicionado para transferência: {item_path}")
    
    def remove_selected_transfers(self):
        """Remove os itens selecionados da lista de transferência"""
        selected_indices = self.transfer_list.curselection()
        if not selected_indices:
            return
        
        # Converter os índices em uma lista antes de removê-los
        indices = list(selected_indices)
        indices.sort(reverse=True)  # Reverter para remover de trás para frente
        
        for index in indices:
            item_text = self.transfer_list.get(index)
            # Extrair o caminho do texto de exibição
            item_path = item_text.split(" (")[0]
            if item_path in self.selected_items:
                del self.selected_items[item_path]
            self.transfer_list.delete(index)
            self.add_to_terminal(f"Removido da transferência: {item_path}")
    
    def start_transfer(self):
        """Inicia a transferência dos itens selecionados"""
        if len(self.selected_items) == 0:
            messagebox.showwarning("Aviso", "Selecione pelo menos um item para transferir.")
            return
        
        if not self.destination_folder:
            messagebox.showwarning("Aviso", "Selecione uma pasta de destino.")
            return
        
        self.add_to_terminal(f"Iniciando transferência de {len(self.selected_items)} itens...")
        
        # Resetar contadores
        self.success_count = 0
        self.failure_count = 0
        self.failed_folders = []
        self.total_files = 0
        self.total_bytes = 0
        self.total_time_seconds = 0
        
        # Resetar exibição de estatísticas
        self.success_count_label.config(text="0")
        self.failure_count_label.config(text="0")
        self.speed_label.config(text="0 MB/s")
        self.total_folders_label.config(text="0")
        self.total_files_label.config(text="0")
        self.total_size_label.config(text="0 MB")
        
        self.failed_folders_text.config(state=tk.NORMAL)
        self.failed_folders_text.delete(1.0, tk.END)
        self.failed_folders_text.config(state=tk.DISABLED)
        
        # Resetar flag de cancelamento
        self.cancel_transfer_flag = False
        
        # Atualizar estado dos botões
        self.start_button['state'] = tk.DISABLED
        self.cancel_button['state'] = tk.NORMAL
        
        # Iniciar transferência em uma thread separada
        threading.Thread(target=self.transfer_items, daemon=True).start()
    
    def transfer_items(self):
        """Transfere os itens selecionados para a pasta de destino"""
        total_items = len(self.selected_items)
        self.progress['maximum'] = total_items
        self.progress['value'] = 0
        
        try:
            # Converter o dicionário em uma lista para poder iterar com índice
            items_to_transfer = list(self.selected_items.items())
            
            for i, (item_path, item_type) in enumerate(items_to_transfer):
                # Verificar se o cancelamento foi solicitado
                if self.cancel_transfer_flag:
                    self.status_label['text'] = "Transferência cancelada!"
                    self.add_to_terminal("Transferência cancelada pelo usuário!")
                    break
                
                item_name = os.path.basename(item_path)
                self.status_label['text'] = f"Transferindo {item_name}..."
                self.add_to_terminal(f"Transferindo: {item_path} para {self.destination_folder}")
                
                # Remover as aspas do comando ADB
                cmd = [os.path.join(self.adb_path, "adb"), "-s", self.device_combo.get(), 
                      "pull", item_path, self.destination_folder]
                
                self.add_to_terminal(f"Executando: {' '.join(cmd)}")
                
                # Usar o método create_process para lidar com codificação
                self.transfer_process = self.create_process(cmd)
                
                # Capturar a saída completa do processo
                output = ""
                for line in self.transfer_process.stdout:
                    line_text = line.strip()
                    self.add_to_terminal(line_text)
                    output += line
                    
                    # Atualizar UI para mostrar progresso em tempo real
                    self.root.update_idletasks()
                
                # Verificar nas últimas linhas da saída se há estatísticas de transferência
                last_lines = output.strip().split('\n')[-3:]  # Últimas 3 linhas
                for line in last_lines:
                    if ("file" in line and "pulled" in line and "bytes in" in line):
                        self.update_transfer_stats(line)
                        break
                
                # Aguardar o término do processo
                exit_code = self.transfer_process.wait()
                
                # Verificar se o cancelamento foi solicitado após cada transferência
                if self.cancel_transfer_flag:
                    self.status_label['text'] = "Transferência cancelada!"
                    self.add_to_terminal("Transferência cancelada pelo usuário!")
                    break
                
                # Atualizar contadores baseados no resultado da transferência
                if exit_code == 0:
                    self.success_count += 1
                    self.success_count_label.config(text=str(self.success_count))
                    self.total_folders_label.config(text=str(self.success_count))
                else:
                    self.failure_count += 1
                    self.failure_count_label.config(text=str(self.failure_count))
                    self.failed_folders.append(item_path)
                    
                    # Atualizar lista de itens com falha
                    self.failed_folders_text.config(state=tk.NORMAL)
                    self.failed_folders_text.delete(1.0, tk.END)
                    self.failed_folders_text.insert(tk.END, ", ".join(self.failed_folders))
                    self.failed_folders_text.config(state=tk.DISABLED)
                    self.add_to_terminal(f"FALHA ao transferir: {item_path}")
                
                self.progress['value'] = i + 1
                self.root.update_idletasks()
            
            if not self.cancel_transfer_flag:
                self.status_label['text'] = "Transferência concluída com sucesso!"
                self.add_to_terminal(f"Transferência concluída: {self.success_count} itens, {self.total_files} arquivos, {self.format_size(self.total_bytes)} transferidos")
                messagebox.showinfo("Sucesso", f"Transferência concluída!\nItens: {self.success_count} de {total_items}\nArquivos: {self.total_files}\nTamanho: {self.format_size(self.total_bytes)}\nVelocidade média: {self.speed_label['text']}")
        
        except Exception as e:
            error_msg = f"Falha na transferência: {e}"
            self.status_label['text'] = "Erro na transferência!"
            self.add_to_terminal(f"ERRO: {error_msg}")
            messagebox.showerror("Erro", error_msg)
        
        finally:
            self.transfer_process = None
            self.start_button['state'] = tk.NORMAL
            self.cancel_button['state'] = tk.DISABLED
    
    def setup_windows_to_android(self, parent_frame):
        """Configura a interface para transferência de arquivos do Windows para o Android"""
        # Painel superior para controles
        upper_panel = ttk.PanedWindow(parent_frame, orient=tk.VERTICAL)
        upper_panel.pack(fill=tk.BOTH, expand=True)
        
        # Frame de controles
        control_frame = ttk.Frame(upper_panel)
        upper_panel.add(control_frame, weight=1)
        
        # Seleção de dispositivo
        device_frame = ttk.LabelFrame(control_frame, text="Dispositivo Android", padding=5)
        device_frame.pack(fill=tk.X, pady=5)
        
        ttk.Label(device_frame, text="Selecione o dispositivo:").grid(row=0, column=0, sticky=tk.W)
        self.reverse_device_combo = ttk.Combobox(device_frame, width=50, state="readonly")
        self.reverse_device_combo.grid(row=0, column=1, padx=5, sticky=tk.W)
        
        refresh_button = ttk.Button(device_frame, text="Atualizar", command=self.load_devices_for_push)
        refresh_button.grid(row=0, column=2, padx=5)
        
        # Pasta de destino no Android
        android_dest_frame = ttk.LabelFrame(control_frame, text="Pasta de Destino no Android", padding=5)
        android_dest_frame.pack(fill=tk.X, pady=5)
        
        ttk.Label(android_dest_frame, text="Pasta:").grid(row=0, column=0, sticky=tk.W, padx=5)
        self.android_dest_combo = ttk.Combobox(android_dest_frame, width=40)
        self.android_dest_combo.grid(row=0, column=1, padx=5, sticky=tk.W, pady=5)
        self.android_dest_combo["values"] = ["/sdcard/DCIM", "/sdcard/Download", "/sdcard/Pictures", "/sdcard/Documents", "/sdcard/Music", "/sdcard/Movies"]
        self.android_dest_combo.current(0)
        
        # Botão para listar pastas no Android
        list_folders_button = ttk.Button(android_dest_frame, text="Listar Pastas", command=self.list_android_folders)
        list_folders_button.grid(row=0, column=2, padx=5)
        
        # Seleção de arquivos/pastas no Windows
        source_frame = ttk.LabelFrame(control_frame, text="Arquivos/Pastas para Transferir", padding=5)
        source_frame.pack(fill=tk.BOTH, expand=True, pady=5)
        
        # Lista de arquivos selecionados
        scrollbar = ttk.Scrollbar(source_frame)
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
        
        self.files_listbox = tk.Listbox(source_frame, selectmode=tk.MULTIPLE)
        self.files_listbox.pack(fill=tk.BOTH, expand=True, side=tk.LEFT)
        
        self.files_listbox.config(yscrollcommand=scrollbar.set)
        scrollbar.config(command=self.files_listbox.yview)
        
        # Botões para adicionar arquivos ou pastas
        files_button_frame = ttk.Frame(source_frame)
        files_button_frame.pack(fill=tk.X, pady=5)
        
        add_files_button = ttk.Button(files_button_frame, text="Adicionar Arquivos", command=self.add_files)
        add_files_button.pack(side=tk.LEFT, padx=5)
        
        add_folder_button = ttk.Button(files_button_frame, text="Adicionar Pasta", command=self.add_folder)
        add_folder_button.pack(side=tk.LEFT, padx=5)
        
        remove_button = ttk.Button(files_button_frame, text="Remover Selecionados", command=self.remove_selected_files)
        remove_button.pack(side=tk.LEFT, padx=5)
        
        # Terminal - ADICIONADO
        terminal_frame = ttk.LabelFrame(parent_frame, text="Terminal", padding=5)
        terminal_frame.pack(fill=tk.BOTH, expand=True, pady=5)
        
        self.push_terminal = scrolledtext.ScrolledText(terminal_frame, wrap=tk.WORD, height=10, 
                                                background="black", foreground="white")
        self.push_terminal.pack(fill=tk.BOTH, expand=True)
        
        # Barra de progresso - ADICIONADO
        progress_frame = ttk.Frame(parent_frame, padding=5)
        progress_frame.pack(fill=tk.X, pady=5)
        
        self.push_progress = ttk.Progressbar(progress_frame, orient=tk.HORIZONTAL, length=100, mode='determinate')
        self.push_progress.pack(fill=tk.X, padx=5)
        
        self.push_status_label = ttk.Label(progress_frame, text="Pronto")
        self.push_status_label.pack(pady=5)
        
        # Estatísticas de Transferência - ADICIONADO
        stats_frame = ttk.LabelFrame(parent_frame, text="Estatísticas de Transferência", padding=5)
        stats_frame.pack(fill=tk.X, pady=5, padx=5)
        
        # Tabela de estatísticas
        stats_grid = ttk.Frame(stats_frame)
        stats_grid.pack(fill=tk.X, pady=2)
        
        # Linha 1
        ttk.Label(stats_grid, text="Velocidade média:").grid(row=0, column=0, sticky=tk.W, padx=5, pady=2)
        self.push_speed_label = ttk.Label(stats_grid, text="0 MB/s")
        self.push_speed_label.grid(row=0, column=1, sticky=tk.W, padx=5, pady=2)
        
        ttk.Label(stats_grid, text="Total de itens:").grid(row=0, column=2, sticky=tk.W, padx=5, pady=2)
        self.push_total_items_label = ttk.Label(stats_grid, text="0")
        self.push_total_items_label.grid(row=0, column=3, sticky=tk.W, padx=5, pady=2)
        
        # Linha 2
        ttk.Label(stats_grid, text="Total de arquivos:").grid(row=1, column=0, sticky=tk.W, padx=5, pady=2)
        self.push_total_files_label = ttk.Label(stats_grid, text="0")
        self.push_total_files_label.grid(row=1, column=1, sticky=tk.W, padx=5, pady=2)
        
        ttk.Label(stats_grid, text="Total transferido:").grid(row=1, column=2, sticky=tk.W, padx=5, pady=2)
        self.push_total_size_label = ttk.Label(stats_grid, text="0 MB")
        self.push_total_size_label.grid(row=1, column=3, sticky=tk.W, padx=5, pady=2)
        
        # Contadores de Sucessos e Falhas - ADICIONADO
        counters_frame = ttk.LabelFrame(parent_frame, text="Resultados da Transferência", padding=5)
        counters_frame.pack(fill=tk.X, pady=5, padx=5)
        
        ttk.Label(counters_frame, text="Transferências bem-sucedidas:").grid(row=0, column=0, sticky=tk.W, padx=5, pady=2)
        self.push_success_count_label = ttk.Label(counters_frame, text="0")
        self.push_success_count_label.grid(row=0, column=1, sticky=tk.W, padx=5, pady=2)
        
        ttk.Label(counters_frame, text="Falhas na transferência:").grid(row=1, column=0, sticky=tk.W, padx=5, pady=2)
        self.push_failure_count_label = ttk.Label(counters_frame, text="0")
        self.push_failure_count_label.grid(row=1, column=1, sticky=tk.W, padx=5, pady=2)
        
        # Lista de falhas
        ttk.Label(counters_frame, text="Itens com falha:").grid(row=2, column=0, sticky=tk.NW, padx=5, pady=2)
        
        failure_frame = ttk.Frame(counters_frame)
        failure_frame.grid(row=2, column=1, sticky=tk.W, padx=5, pady=2)
        
        self.push_failed_items_text = tk.Text(failure_frame, wrap=tk.WORD, height=3, width=40, state=tk.DISABLED)
        self.push_failed_items_text.pack(side=tk.LEFT, fill=tk.BOTH)
        
        failure_scrollbar = ttk.Scrollbar(failure_frame, command=self.push_failed_items_text.yview)
        failure_scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
        self.push_failed_items_text.config(yscrollcommand=failure_scrollbar.set)
        
        # Botões de controle
        button_frame = ttk.Frame(parent_frame)
        button_frame.pack(pady=10)
        
        self.push_start_button = ttk.Button(button_frame, text="Iniciar Upload para Android", command=self.start_push_transfer)
        self.push_start_button.pack(side=tk.LEFT, padx=5)
        
        self.push_cancel_button = ttk.Button(button_frame, text="Cancelar", command=self.cancel_push_transfer, state=tk.DISABLED)
        self.push_cancel_button.pack(side=tk.LEFT, padx=5)
        
    def load_devices_for_push(self):
        """Carrega dispositivos para transferência Windows -> Android"""
        self.load_devices()
        self.reverse_device_combo["values"] = self.devices
        if self.devices:
            self.reverse_device_combo.current(0)
    
    def list_android_folders(self):
        """Lista as pastas no dispositivo Android para seleção como destino"""
        device_id = self.reverse_device_combo.get()
        if not device_id:
            messagebox.showwarning("Aviso", "Selecione um dispositivo primeiro!")
            return
            
        try:
            self.add_to_terminal(f"Listando pastas do Android em /sdcard/...")
            cmd = [os.path.join(self.adb_path, "adb"), "-s", device_id, "shell", "find", "/sdcard/", "-maxdepth", "1", "-type", "d"]
            
            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                check=True
            )
            
            folders = [line.strip() for line in result.stdout.strip().split('\n') if line.strip()]
            
            if folders:
                self.android_dest_combo["values"] = folders
                self.add_to_terminal(f"Encontradas {len(folders)} pastas no dispositivo")
            else:
                self.add_to_terminal("Nenhuma pasta encontrada")
                
        except Exception as e:
            error_msg = f"Erro ao listar pastas: {e}"
            self.add_to_terminal(f"ERRO: {error_msg}")
            messagebox.showerror("Erro", error_msg)
    
    def add_files(self):
        """Adiciona arquivos à lista para transferência"""
        files = filedialog.askopenfilenames(title="Selecione os arquivos para transferir")
        if files:
            for file in files:
                self.files_listbox.insert(tk.END, file)
            self.add_to_terminal(f"Adicionados {len(files)} arquivos à lista")
    
    def add_folder(self):
        """Adiciona múltiplas pastas à lista para transferência"""
        # Usando uma janela de diálogo personalizada para permitir seleção múltipla
        folders = []
        while True:
            folder = filedialog.askdirectory(title="Selecione uma pasta para transferir (Cancele para finalizar)")
            if not folder:  # Se o usuário clicar em Cancelar
                break
            folders.append(folder)
        
        if folders:
            for folder in folders:
                self.files_listbox.insert(tk.END, folder)
            self.add_to_terminal(f"Adicionadas {len(folders)} pasta(s): {', '.join(folders)}")
    
    def remove_selected_files(self):
        """Remove os itens selecionados da lista de transferência"""
        selected_indices = self.files_listbox.curselection()
        if not selected_indices:
            return
            
        # Remover de trás para frente para evitar problemas com índices
        for index in sorted(selected_indices, reverse=True):
            self.files_listbox.delete(index)
            
        self.add_to_terminal(f"Removidos {len(selected_indices)} itens da lista")
    
    def start_push_transfer(self):
        """Inicia a transferência de arquivos do Windows para o Android"""
        # Verificar se há itens para transferir
        if self.files_listbox.size() == 0:
            messagebox.showwarning("Aviso", "Adicione pelo menos um arquivo ou pasta para transferir.")
            return
            
        # Verificar se um dispositivo está selecionado
        device_id = self.reverse_device_combo.get()
        if not device_id:
            messagebox.showwarning("Aviso", "Selecione um dispositivo Android.")
            return
            
        # Verificar se o destino está selecionado
        android_destination = self.android_dest_combo.get()
        if not android_destination:
            messagebox.showwarning("Aviso", "Selecione uma pasta de destino no Android.")
            return
            
        # Preparar para transferência
        self.add_to_terminal(f"Iniciando transferência para {android_destination} no dispositivo {device_id}")
        
        # Resetar contadores
        self.success_count = 0
        self.failure_count = 0
        self.failed_folders = []
        self.total_files = 0
        self.total_bytes = 0
        self.total_time_seconds = 0
        
        # Resetar exibição de estatísticas
        self.push_success_count_label.config(text="0")
        self.push_failure_count_label.config(text="0")
        self.push_speed_label.config(text="0 MB/s")
        self.push_total_items_label.config(text="0")
        self.push_total_files_label.config(text="0")
        self.push_total_size_label.config(text="0 MB")
        
        self.push_failed_items_text.config(state=tk.NORMAL)
        self.push_failed_items_text.delete(1.0, tk.END)
        self.push_failed_items_text.config(state=tk.DISABLED)
        
        # Resetar flag de cancelamento
        self.cancel_transfer_flag = False
        
        # Atualizar estado dos botões
        self.push_start_button['state'] = tk.DISABLED
        self.push_cancel_button['state'] = tk.NORMAL
        
        # Iniciar transferência em uma thread separada
        self.items_to_transfer = list(self.files_listbox.get(0, tk.END))
        threading.Thread(target=self.push_files_to_android, args=(device_id, android_destination), daemon=True).start()
    
    def push_files_to_android(self, device_id, android_destination):
        """Transfere arquivos do Windows para o Android"""
        total_items = len(self.items_to_transfer)
        self.push_progress['maximum'] = total_items
        self.push_progress['value'] = 0
        
        try:
            for i, item_path in enumerate(self.items_to_transfer):
                # Verificar se o cancelamento foi solicitado
                if self.cancel_transfer_flag:
                    self.push_status_label['text'] = "Transferência cancelada!"
                    self.add_to_terminal("Transferência cancelada pelo usuário!")
                    break
                
                item_name = os.path.basename(item_path)
                self.push_status_label['text'] = f"Transferindo {item_name}..."
                self.add_to_terminal(f"Transferindo: {item_path} para {android_destination}/{item_name}")
                
                cmd = [os.path.join(self.adb_path, "adb"), "-s", device_id, 
                      "push", item_path, android_destination]
                self.add_to_terminal(f"Executando: {' '.join(cmd)}")
                
                self.transfer_process = subprocess.Popen(
                    cmd,
                    stdout=subprocess.PIPE,
                    stderr=subprocess.STDOUT,
                    text=True,
                    bufsize=1,
                    universal_newlines=True
                )
                
                # Capturar a saída completa do processo
                output = ""
                for line in self.transfer_process.stdout:
                    line_text = line.strip()
                    self.add_to_terminal(line_text)
                    output += line
                    
                    # Atualizar UI para mostrar progresso em tempo real
                    self.root.update_idletasks()
                
                # Aguardar o término do processo
                exit_code = self.transfer_process.wait()
                
                # Verificar se o cancelamento foi solicitado após cada transferência
                if self.cancel_transfer_flag:
                    self.push_status_label['text'] = "Transferência cancelada!"
                    self.add_to_terminal("Transferência cancelada pelo usuário!")
                    break
                
                # Extrair estatísticas de transferência do output
                try:
                    # Procurar padrões como "X files pushed" ou informações sobre taxa de transferência
                    size_match = re.search(r'(\d+) files? pushed[.,] (\d+) skipped', output)
                    if size_match:
                        files_pushed = int(size_match.group(1))
                        self.total_files += files_pushed
                        self.push_total_files_label.config(text=str(self.total_files))
                    
                    # Corrigir o padrão regex para corresponder com a saída real do ADB push
                    # Formato: "42.7 MB/s (1728343295 bytes in 38.619s)"
                    speed_match = re.search(r'([\d.]+) MB/s \((\d+) bytes in ([\d.]+)s\)', output)
                    if speed_match:
                        speed = float(speed_match.group(1))  # MB/s
                        size_bytes = int(speed_match.group(2))  # bytes (não MB!)
                        transfer_time = float(speed_match.group(3))  # segundos
                        
                        self.total_bytes += size_bytes  # Adicionar bytes diretamente
                        self.total_time_seconds += transfer_time
                        
                        # Atualizar estatísticas na UI
                        self.push_total_files_label.config(text=str(self.total_files))
                        self.push_total_size_label.config(text=self.format_size(self.total_bytes))
                        
                        if self.total_time_seconds > 0:
                            avg_speed = self.total_bytes / self.total_time_seconds / (1024 * 1024)  # MB/s
                            self.push_speed_label.config(text=f"{avg_speed:.1f} MB/s")
                except Exception as e:
                    self.add_to_terminal(f"Aviso: Não foi possível extrair estatísticas: {e}")
                
                # Atualizar contadores baseados no resultado da transferência
                if exit_code == 0:
                    self.success_count += 1
                    self.push_success_count_label.config(text=str(self.success_count))
                    self.push_total_items_label.config(text=str(self.success_count))
                else:
                    self.failure_count += 1
                    self.push_failure_count_label.config(text=str(self.failure_count))
                    self.failed_folders.append(item_name)
                    
                    # Atualizar lista de itens com falha
                    self.push_failed_items_text.config(state=tk.NORMAL)
                    self.push_failed_items_text.delete(1.0, tk.END)
                    self.push_failed_items_text.insert(tk.END, ", ".join(self.failed_folders))
                    self.push_failed_items_text.config(state=tk.DISABLED)
                    self.add_to_terminal(f"FALHA ao transferir: {item_name}")
                
                self.push_progress['value'] = i + 1
                self.root.update_idletasks()
            
            if not self.cancel_transfer_flag:
                self.push_status_label['text'] = "Upload concluído com sucesso!"
                self.add_to_terminal(f"Upload concluído: {self.success_count} itens, {self.total_files} arquivos, {self.format_size(self.total_bytes)} transferidos")
                messagebox.showinfo("Sucesso", f"Upload concluído!\nItens: {self.success_count} de {total_items}\nArquivos: {self.total_files}\nTamanho: {self.format_size(self.total_bytes)}\nVelocidade média: {self.push_speed_label['text']}")
        
        except Exception as e:
            error_msg = f"Falha na transferência: {e}"
            self.push_status_label['text'] = "Erro na transferência!"
            self.add_to_terminal(f"ERRO: {error_msg}")
            messagebox.showerror("Erro", error_msg)
        
        finally:
            self.transfer_process = None
            self.push_start_button['state'] = tk.NORMAL
            self.push_cancel_button['state'] = tk.DISABLED
    
    def cancel_push_transfer(self):
        """Cancela a transferência de arquivos para o Android"""
        self.cancel_transfer_flag = True
        self.status_label['text'] = "Cancelando transferência..."
        self.add_to_terminal("Cancelando transferência...")
        
        # Se houver um processo em execução, tente encerrá-lo
        if self.transfer_process:
            try:
                self.transfer_process.terminate()
            except:
                pass

    def setup_wifi_interface(self, parent_frame):
        # Instrução principal
        ttk.Label(parent_frame, text="Conexão ADB sem Fio", font=("Arial", 12, "bold")).pack(pady=10)
        ttk.Label(parent_frame, text="Digite as informações do dispositivo para conexão sem fio:").pack(pady=5)
        
        # Frame para conexão direta com entrada manual
        connection_frame = ttk.LabelFrame(parent_frame, text="Conexão Manual", padding=10)
        connection_frame.pack(fill=tk.X, padx=10, pady=10)
        
        # IP do dispositivo
        ip_frame = ttk.Frame(connection_frame)
        ip_frame.pack(fill=tk.X, pady=5)
        ttk.Label(ip_frame, text="IP do dispositivo Android:").grid(row=0, column=0, sticky=tk.W, padx=5)
        self.device_ip_entry = ttk.Entry(ip_frame, width=20)
        self.device_ip_entry.grid(row=0, column=1, sticky=tk.W, padx=5)
        ttk.Label(ip_frame, text="(ex: 192.168.1.100)").grid(row=0, column=2, sticky=tk.W, padx=5)
        
        # Porta
        port_frame = ttk.Frame(connection_frame)
        port_frame.pack(fill=tk.X, pady=5)
        ttk.Label(port_frame, text="Porta:").grid(row=0, column=0, sticky=tk.W, padx=5)
        self.port_entry = ttk.Entry(port_frame, width=10)
        self.port_entry.insert(0, "5555")
        self.port_entry.grid(row=0, column=1, sticky=tk.W, padx=5)
        
        # Código de pareamento
        pairing_frame = ttk.Frame(connection_frame)
        pairing_frame.pack(fill=tk.X, pady=5)
        ttk.Label(pairing_frame, text="Código de pareamento:").grid(row=0, column=0, sticky=tk.W, padx=5)
        self.pairing_code_entry = ttk.Entry(pairing_frame, width=15)
        self.pairing_code_entry.grid(row=0, column=1, sticky=tk.W, padx=5)
        ttk.Label(pairing_frame, text="(opcional, para Android 11+)").grid(row=0, column=2, sticky=tk.W, padx=5)
        
        # Botões de ação
        button_frame = ttk.Frame(connection_frame)
        button_frame.pack(fill=tk.X, pady=10)
        
        self.connect_button = ttk.Button(button_frame, text="Conectar via Wi-Fi", command=self.connect_over_wifi)
        self.connect_button.pack(side=tk.LEFT, padx=5)
        
        self.disconnect_button = ttk.Button(button_frame, text="Desconectar", command=self.disconnect_wifi, state=tk.DISABLED)
        self.disconnect_button.pack(side=tk.LEFT, padx=5)
        
        # Ajuda para encontrar IP
        help_frame = ttk.LabelFrame(parent_frame, text="Como encontrar as informações", padding=10)
        help_frame.pack(fill=tk.BOTH, expand=True, padx=10, pady=10)
        
        help_text = """
        Para encontrar o IP do dispositivo:
          1. Vá para Configurações > Sobre o telefone > Status > Endereço IP

        Para usar o código de pareamento (Android 11+):
          1. Vá para Configurações > Opções do desenvolvedor
          2. Ative "Depuração sem fio"
          3. Toque em "Parear dispositivo com código"
          4. Digite o código aqui
        
        Para dispositivos Android 10 ou anteriores:
          1. Conecte via USB primeiro
          2. Clique no botão abaixo para configurar o modo sem fio
        """
        ttk.Label(help_frame, text=help_text, justify=tk.LEFT).pack(fill=tk.X)
        
        # Frame para a configuração inicial via USB (para dispositivos antigos)
        usb_init_frame = ttk.LabelFrame(parent_frame, text="Inicialização via USB (Android 10 ou anterior)", padding=10)
        usb_init_frame.pack(fill=tk.X, padx=10, pady=10)
        
        # Dispositivo conectado via USB
        device_frame = ttk.Frame(usb_init_frame)
        device_frame.pack(fill=tk.X, pady=5)
        ttk.Label(device_frame, text="Dispositivo USB:").grid(row=0, column=0, sticky=tk.W, padx=5)
        self.wifi_device_combo = ttk.Combobox(device_frame, width=40, state="readonly")
        self.wifi_device_combo.grid(row=0, column=1, sticky=tk.W, padx=5)
        
        refresh_wifi_button = ttk.Button(device_frame, text="Atualizar", command=self.load_usb_devices)
        refresh_wifi_button.grid(row=0, column=2, padx=5)
        
        # Botão para iniciar modo sem fio no dispositivo conectado
        enable_wifi_button = ttk.Button(usb_init_frame, text="Habilitar Modo Sem Fio", command=self.enable_wireless_mode)
        enable_wifi_button.pack(pady=5)
        
        # Status da conexão
        status_frame = ttk.Frame(parent_frame)
        status_frame.pack(fill=tk.X, padx=10, pady=5)
        
        self.wifi_status_label = ttk.Label(status_frame, text="Status: Desconectado", foreground="red")
        self.wifi_status_label.pack(pady=5)
        
        # Carregar dispositivos USB iniciais
        self.load_usb_devices()

    def get_local_ip(self):
        """Obtém o IP local do computador"""
        try:
            s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            s.connect(("8.8.8.8", 80))
            ip = s.getsockname()[0]
            s.close()
            return ip
        except:
            return "127.0.0.1"
    
    def load_usb_devices(self):
        """Carrega dispositivos conectados via USB para a interface Wi-Fi"""
        try:
            result = subprocess.run(
                [os.path.join(self.adb_path, "adb"), "devices"], 
                capture_output=True, 
                text=True,
                check=True
            )
            
            devices = []
            lines = result.stdout.strip().split('\n')[1:]
            for line in lines:
                if line.strip() and "device" in line:
                    device_id = line.split("\t")[0].strip()
                    devices.append(device_id)
            
            self.wifi_device_combo['values'] = devices
            if devices:
                self.wifi_device_combo.current(0)
            else:
                self.wifi_device_combo.set("")
        
        except Exception as e:
            messagebox.showerror("Erro", f"Não foi possível listar os dispositivos USB: {e}")
    
    def connect_over_wifi(self):
        """Estabelece conexão ADB sem fio com o dispositivo através do IP e porta fornecidos"""
        device_ip = self.device_ip_entry.get().strip()
        port = self.port_entry.get().strip()
        pairing_code = self.pairing_code_entry.get().strip()
        
        if not device_ip:
            messagebox.showwarning("Aviso", "Digite o endereço IP do dispositivo")
            return
        
        if not port.isdigit():
            messagebox.showwarning("Aviso", "A porta deve ser um número")
            return
        
        try:
            self.add_to_terminal(f"Tentando conectar a {device_ip}:{port}")
            
            # Se houver código de pareamento, usar o processo de pareamento primeiro
            if (pairing_code):
                self.add_to_terminal(f"Iniciando pareamento com código")
                
                # Parear usando o código
                result = subprocess.run(
                    [os.path.join(self.adb_path, "adb"), "pair", f"{device_ip}:{port}", pairing_code],
                    capture_output=True,
                    text=True,
                    check=False
                )
                
                self.add_to_terminal(result.stdout)
                if result.returncode != 0:
                    raise Exception(f"Falha no pareamento: {result.stderr}")
                
                # Após parear, a porta padrão para conectar é 5555
                connect_port = "5555"
            else:
                connect_port = port
            
            # Conectar ao dispositivo
            connection_string = f"{device_ip}:{connect_port}"
            result = subprocess.run(
                [os.path.join(self.adb_path, "adb"), "connect", connection_string],
                capture_output=True,
                text=True,
                check=False
            )
            
            self.add_to_terminal(result.stdout)
            
            if "connected" in result.stdout.lower():
                messagebox.showinfo("Sucesso", f"Conectado com sucesso a {connection_string}")
                self.wifi_status_label.config(text=f"Status: Conectado a {connection_string}", foreground="green")
                
                # Atualizar estados dos botões
                self.connect_button.config(state=tk.DISABLED)
                self.disconnect_button.config(state=tk.NORMAL)
                
                # Atualizar lista de dispositivos na interface principal
                self.load_devices()
            else:
                messagebox.showerror("Erro", f"Falha na conexão: {result.stdout}")
                
        except Exception as e:
            error_msg = f"Erro ao conectar: {e}"
            self.add_to_terminal(f"ERRO: {error_msg}")
            messagebox.showerror("Erro", error_msg)
    
    def disconnect_wifi(self):
        """Desconecta o dispositivo Wi-Fi"""
        try:
            subprocess.run(
                [os.path.join(self.adb_path, "adb"), "disconnect"],
                check=True
            )
            
            messagebox.showinfo("Desconexão", "Dispositivo Wi-Fi desconectado com sucesso")
            
            # Atualizar interface
            self.connect_button.config(state=tk.NORMAL)
            self.disconnect_button.config(state=tk.DISABLED)
            
            # Limpar QR Code
            self.qr_label.config(image='', text="Clique em 'Conectar via Wi-Fi' para gerar um QR Code")
            
            # Atualizar lista de dispositivos na interface principal
            self.load_devices()
            
        except Exception as e:
            messagebox.showerror("Erro", f"Erro ao desconectar: {e}")
    
    def generate_qr_code(self, data):
        """Gera e exibe um QR code com os dados fornecidos"""
        try:
            # Criar QR code
            qr = qrcode.QRCode(
                version=1,
                error_correction=qrcode.constants.ERROR_CORRECT_L,
                box_size=10,
                border=4,
            )
            qr.add_data(data)
            qr.make(fit=True)
            
            img = qr.make_image(fill_color="black", back_color="white")
            
            # Converter para formato compatível com tkinter
            img_tk = ImageTk.PhotoImage(img)
            
            # Exibir na interface
            self.qr_label.config(image=img_tk, text="")
            self.qr_label.image = img_tk  # Manter referência
            
            return True
        except Exception as e:
            messagebox.showerror("Erro", f"Erro ao gerar QR code: {e}")
            return False

    def enable_wireless_mode(self):
        """Habilita o modo sem fio para um dispositivo conectado via USB"""
        device_id = self.wifi_device_combo.get()
        port = self.port_entry.get().strip()
        
        if not device_id:
            messagebox.showwarning("Aviso", "Selecione um dispositivo USB primeiro")
            return
        
        if not port.isdigit():
            messagebox.showwarning("Aviso", "A porta deve ser um número")
            return
        
        try:
            self.add_to_terminal(f"Habilitando modo sem fio no dispositivo {device_id}")
            
            # Configurar porta TCP/IP no dispositivo
            result = subprocess.run(
                [os.path.join(self.adb_path, "adb"), "-s", device_id, "tcpip", port],
                capture_output=True,
                text=True,
                check=True
            )
            
            self.add_to_terminal(result.stdout)
            
            # Obter endereço IP do dispositivo
            result = subprocess.run(
                [os.path.join(self.adb_path, "adb"), "-s", device_id, "shell", "ip", "route"],
                capture_output=True,
                text=True,
                check=True
            )
            
            # Extrair IP do dispositivo do output
            device_ip = None
            for line in result.stdout.split("\n"):
                if "wlan0" in line and "src" in line:
                    parts = line.split()
                    for i, part in enumerate(parts):
                        if part == "src" and i+1 < len(parts):
                            device_ip = parts[i+1]
                            break
            
            if not device_ip:
                messagebox.showerror("Erro", "Não foi possível determinar o IP do dispositivo")
                return
            
            # Preencher automaticamente o campo de IP
            self.device_ip_entry.delete(0, tk.END)
            self.device_ip_entry.insert(0, device_ip)
            
            messagebox.showinfo(
                "Modo Sem Fio Habilitado", 
                f"O dispositivo está pronto para conexão sem fio.\n\n"
                f"IP: {device_ip}\n"
                f"Porta: {port}\n\n"
                f"Você pode desconectar o cabo USB e clicar em 'Conectar via Wi-Fi'."
            )
            
        except Exception as e:
            error_msg = f"Erro ao habilitar modo sem fio: {e}"
            self.add_to_terminal(f"ERRO: {error_msg}")
            messagebox.showerror("Erro", error_msg)

    def add_to_terminal(self, text):
        """Adiciona texto ao terminal de ambas as interfaces"""
        self.output_queue.put(text)
        
    def update_terminal_output(self):
        """Thread para atualizar o terminal com saídas de comandos"""
        while True:
            try:
                # Verificar se há novas mensagens na fila
                while not self.output_queue.empty():
                    message = self.output_queue.get()
                    # Atualizar o terminal da interface Android -> Windows
                    self.terminal.config(state=tk.NORMAL)
                    self.terminal.insert(tk.END, message + "\n")
                    self.terminal.see(tk.END)
                    self.terminal.config(state=tk.DISABLED)
                    
                    # Atualizar também o terminal da interface Windows -> Android
                    try:
                        self.push_terminal.config(state=tk.NORMAL)
                        self.push_terminal.insert(tk.END, message + "\n")
                        self.push_terminal.see(tk.END)
                        self.push_terminal.config(state=tk.DISABLED)
                    except:
                        pass  # Se ainda não existir
                    
                time.sleep(0.1)
            except Exception as e:
                print(f"Erro ao atualizar terminal: {e}")
    
    def load_devices(self):
        self.devices = []
        self.add_to_terminal("Procurando dispositivos conectados...")
        
        try:
            cmd = [os.path.join(self.adb_path, "adb"), "devices"]
            self.add_to_terminal(f"Executando: {' '.join(cmd)}")
            
            result = subprocess.run(
                cmd, 
                capture_output=True, 
                text=True,
                check=True
            )
            
            self.add_to_terminal(result.stdout)
            
            lines = result.stdout.strip().split('\n')[1:]
            for line in lines:
                if line.strip() and "device" in line:
                    device_id = line.split("\t")[0].strip()
                    self.devices.append(device_id)
            
            self.device_combo['values'] = self.devices
            if self.devices:
                self.device_combo.current(0)
                self.on_device_selected(None)
                self.add_to_terminal(f"Dispositivo selecionado: {self.device_combo.get()}")
            else:
                messagebox.showinfo("Informação", "Nenhum dispositivo Android conectado.")
                self.add_to_terminal("Nenhum dispositivo Android encontrado")
        
        except Exception as e:
            error_msg = f"Não foi possível listar os dispositivos: {e}"
            messagebox.showerror("Erro", error_msg)
            self.add_to_terminal(f"ERRO: {error_msg}")
    
    def browse_destination(self):
        folder = filedialog.askdirectory(title="Selecione a pasta de destino")
        if folder:
            self.destination_folder = folder
            self.dest_entry.delete(0, tk.END)
            self.dest_entry.insert(0, folder)
            self.add_to_terminal(f"Pasta de destino selecionada: {folder}")
    
    def cancel_transfer(self):
        self.cancel_transfer_flag = True
        self.status_label['text'] = "Cancelando transferência..."
        self.add_to_terminal("Cancelando transferência...")
        
        # Se houver um processo em execução, tente encerrá-lo
        if self.transfer_process:
            try:
                self.transfer_process.terminate()
            except:
                pass
    
    def parse_adb_output(self, output):
        """Extrai estatísticas da saída do ADB"""
        files_pulled = 0
        bytes_transferred = 0
        transfer_time = 0
        
        # Regex melhorada para encontrar "X file(s) pulled" - considera tanto singular quanto plural
        files_match = re.search(r'(\d+) files? pulled', output)
        if files_match:
            files_pulled = int(files_match.group(1))
        
        # Regex melhorada para encontrar tamanho e tempo
        # Captura a velocidade em MB/s e os bytes transferidos
        transfer_match = re.search(r'([\d.]+) MB/s \((\d+) bytes in ([\d.]+)s\)', output)
        if transfer_match:
            bytes_transferred = int(transfer_match.group(2))
            transfer_time = float(transfer_match.group(3))
        
        return files_pulled, bytes_transferred, transfer_time

    def format_size(self, size_bytes):
        """Formata tamanho em bytes para uma representação legível"""
        if size_bytes < 1024:
            return f"{size_bytes} B"
        elif size_bytes < 1024 * 1024:
            return f"{size_bytes/1024:.1f} KB"
        elif size_bytes < 1024 * 1024 * 1024:
            return f"{size_bytes/(1024*1024):.1f} MB"
        else:
            return f"{size_bytes/(1024*1024*1024):.2f} GB"
    
    def update_transfer_stats(self, output):
        """Atualiza as estatísticas de transferência baseado na saída do ADB"""
        files, bytes_transferred, time_seconds = self.parse_adb_output(output)
        
        # Atualizar contadores
        self.total_files += files
        self.total_bytes += bytes_transferred
        self.total_time_seconds += time_seconds
        
        # Atualizar UI
        self.total_files_label.config(text=str(self.total_files))
        self.total_size_label.config(text=self.format_size(self.total_bytes))
        
        # Calcular e atualizar velocidade média
        if self.total_time_seconds > 0:
            avg_speed = self.total_bytes / self.total_time_seconds / (1024 * 1024)  # MB/s
            self.speed_label.config(text=f"{avg_speed:.1f} MB/s")
    
    def read_process_output(self, process):
        """Lê a saída do processo e a adiciona ao terminal em tempo real"""
        full_output = ""
        while True:
            output = process.stdout.readline()
            if output == '' and process.poll() is not None:
                break
            if output:
                line = output.strip()
                self.add_to_terminal(line)
                full_output += line + "\n"
        return full_output
    
    def output_capture(self, process):
        """Captura e processa a saída do processo de transferência"""
        output = ""
        last_line = ""
        
        for line in process.stdout:
            line_text = line.strip()
            self.add_to_terminal(line_text)
            output += line
            last_line = line_text
        
        # Verificar se a última linha contém as estatísticas de transferência
        if ("file" in last_line and "pulled" in last_line and 
            "bytes in" in last_line):
            self.update_transfer_stats(last_line)
            return last_line
        
        return output

    def open_destination_folder(self):
        """Abre a pasta de destino no explorador de arquivos"""
        if not self.destination_folder:
            messagebox.showwarning("Aviso", "Selecione uma pasta de destino primeiro.")
            return
            
        try:
            os.startfile(self.destination_folder)
            self.add_to_terminal(f"Abrindo pasta: {self.destination_folder}")
        except Exception as e:
            error_msg = f"Erro ao abrir pasta: {e}"
            self.add_to_terminal(f"ERRO: {error_msg}")
            messagebox.showerror("Erro", error_msg)

if __name__ == "__main__":
    app = AndroidFileTransfer()
