class HashMap {
    constructor() {
        this.buckets = new Array(16);
        this.capacity = this.buckets.length;
        this.loadFactor = 0.75;
    }

    hash(key) {
        let hashCode = 0;

        const primeNumber = 31;
        for (let i = 0; i < key.length; i++) {
            hashCode = primeNumber * hashCode + key.charCodeAt(i);
        }

        hashCode %= this.capacity;

        return hashCode;
    }

    set(key, value) {
        const hashCode = this.hash(key);
        const item = new Item(key, value);
        const bucket = this.buckets[hashCode];
        if (!bucket) {
            this.buckets[hashCode] = item;
        } else if (bucket && bucket.key === key) {
            this.buckets[hashCode].value = value;
        } else if (bucket && bucket.key !== key) {
            this.buckets[hashCode].prevNode = item;
            item.nextNode = this.buckets[hashCode];
            this.buckets[hashCode] = item;
        }

        let count = 0;
        for (let i = 0; i < this.capacity; i++) {
            if (this.buckets[i]) {
                count++;
            }
        }
        if (count > (this.capacity * this.loadFactor)) {
            this.buckets.length *= 2;
            this.capacity = this.buckets.length;
            let node;
            this.buckets.forEach((item) => {
                if (item) {
                    node = item;
                    this.remove(`${item.key}`);
                    this.set(`${node.key}`, `${node.value}`);
                }
            });
        }
    }

    get(key) {
        const hashCode = this.hash(key);
        let node = this.buckets[hashCode];
        while (node) {
            if (node.key === key) {
                return node.value;
            }
            node = node.nextNode;
        }
        return null;
    }

    has(key) {
        const hashCode = this.hash(key);
        let node = this.buckets[hashCode];
        while (node) {
            if(node.key === key) {
                return true;
            }
            node = node.nextNode
        }
        return false;
    }

    remove(key) {
        const hashCode = this.hash(key);
        let node = this.buckets[hashCode];
        let count = 0;
        while (node) {
            if (node.key === key) {
                if (node === this.buckets[hashCode]) {
                    this.buckets[hashCode] = node.nextNode;
                    return true;
                } else {
                    node.prevNode.nextNode = node.nextNode;
                    node.nextNode = node.prevNode;
                    return true;
                }
            }
            count++;
            node = node.nextNode;
        }
        return false;
    }

    length() {
        let count = 0;
        let node;
        this.buckets.forEach((item) => {
            if (item) {
                node = item;
                while (node) {
                    count++;
                    node = node.nextNode;
                }
            }
        })
        return count;
    }

    clear() {
        this.buckets = new Array(16);
    }

    keys() {
        const keys = [];
        let node;
        this.buckets.forEach((item) => {
            if (item) {
                node = item;
                while (node) {
                    keys.push(node.key);
                    node = node.nextNode;
                }
            }
        })
        return keys;
    }

    values() {
        const values = [];
        let node;
        this.buckets.forEach((item) => {
            if (item) {
                node = item;
                while (node) {
                    values.push(node.value);
                    node = node.nextNode;
                }
            }
        })
        return values;
    }

    entries() {
        const entries = [];
        let node;
        this.buckets.forEach((item) => {
            if (item) {
                node = item;
                while (node) {
                    entries.push([node.key, node.value]);
                    node = node.nextNode;
                }
            }
        })
        return entries;
    }
}

class Item {
    constructor(key, value) {
        this.key = key;
        this.value = value;
        this.nextNode = null;
        this.prevNode = null;
    }
}